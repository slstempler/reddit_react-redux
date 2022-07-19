import { useSelector, useDispatch } from "react-redux";
import { selectAfter, 
    selectLoading, 
    selectPosts, 
    getPosts,
    selectBefore } from "./postsSlice";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Post } from "./Post";
import { useEffect } from "react";

export const Posts = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectPosts);
    const arePostsLoading = useSelector(selectLoading);
    const params = useParams();
    const subredditSelection = params.subreddit;
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    //URL Query Management
    //base case - getting before/after from store having used pages
    let after = useSelector(selectAfter);
    let before = useSelector(selectBefore);

    // Search Parameters Handling: 
    // 1. if we have a direct URL query, prefer that
    // 2. if we don't - either from Posts or Thread, prefer store
    // 3. if we have neither, go to default


    const handleLoadPosts = (e) => {
        e.preventDefault();
        dispatch(getPosts(subredditSelection, after));
    }

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

    useEffect(firstRender, []);
    //resets scroll position after a new page is loaded
    //reset the dependency array once more URL params implemented?
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [after])

    return (
        <section className="posts">
            {arePostsLoading && <p>Loading...</p>}
            {posts.map(post => {
                //console.log(post);
                return <Post postData={post.data} key={post.data.id}/>
            })}
            {!arePostsLoading && 
                <button type="button" onClick={handlePrevPage}>&lt; Prev Page</button>
            }
            {!arePostsLoading &&
                <button type="button" onClick={handleNextPage}>Next Page &gt;</button>
            }
        </section>
    );
}