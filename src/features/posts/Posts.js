import { useSelector, useDispatch } from "react-redux";
import { selectAfter, 
    selectLoading, 
    selectPosts, 
    getPosts,
    selectBefore } from "./postsSlice";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { Post } from "./Post";
import { useEffect } from "react";
import { Button } from "@mui/material";
import './posts.css';

export const Posts = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectPosts);
    const arePostsLoading = useSelector(selectLoading);
    const params = useParams();
    const subredditSelection = params.subreddit;
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    //URL Query Management
    //base case - getting before/after from store having used pages
    let after = useSelector(selectAfter);
    let before = useSelector(selectBefore);


    // Search Parameters Handling: 
    // 1. if we have a direct URL query, prefer that
    // 2. if we don't - either from Posts or Thread, prefer store
    // 3. if we have neither, go to default

    const handleNextPage = (e) => {
        e.preventDefault();
        dispatch(getPosts({subreddit: subredditSelection, after: after}));
        after && setSearchParams({after: after}); //sets URL query
    }

    const handlePrevPage = (e) => {
        e.preventDefault();
        dispatch(getPosts({subreddit: subredditSelection, before: before}));
        before && setSearchParams({before: before}); //sets URL query
    }

    //dispatches getPosts action on first render and on route shift
    //utilizes useEffect hook per React demands and useLocation to 
    const firstRender = () => {
        
        // update tab/window title
        document.title = subredditSelection + " | RE:ddit";

        let searchBefore = ''; 
        let searchAfter = '';

        //handle URL query
        if(searchParams.has('after')){
            searchAfter = searchParams.get('after');
        } 
        else if(searchParams.has('before')){
            searchBefore = searchParams.get('before');
        } 

        dispatch(getPosts({subreddit: subredditSelection, after: searchAfter, before: searchBefore}));
    }

    // React-Redux flow interfering with linter prefs per https://github.com/facebook/create-react-app/issues/6880 - requires rework of logic
    // eslint-disable-next-line
    useEffect(firstRender, [location]);

    //resets scroll position after a new page is loaded
    //reset the dependency array once more URL params implemented?
    useEffect(() => {
        window.scrollTo(0, 0);
        document.getElementById("navbar-expandable").classList.add('hamburger-closed');
        document.getElementById('navbar-expandable').classList.remove('hamburger-open');
        document.getElementById('modal-fade').classList.remove('modal-fade-active');
        document.getElementById('modal-fade').classList.add('modal-fade-inactive');
      }, [after])

    return (
        <section className="posts-page">
            {arePostsLoading && <p>Loading...</p>}
            <h1 className="posts-subreddit-header">r/{subredditSelection.toLowerCase()}</h1>
            <div className="posts-container">
                {posts.map(post => {
                    return <Post postData={post.data} key={post.data.id}/>
                })}
            </div>
            <div className="posts-nav-tray">
                {!arePostsLoading && (searchParams.has('after') || searchParams.has('before')) &&
                    <Button type="button" variant="outlined" onClick={handlePrevPage} className="posts-pageNav">&lt; Prev Page</Button> 
                }
                {!arePostsLoading &&
                    <Button type="button" variant="outlined" onClick={handleNextPage} className="posts-pageNav">Next Page &gt;</Button> 
                }
            </div>
        </section>
    );
}