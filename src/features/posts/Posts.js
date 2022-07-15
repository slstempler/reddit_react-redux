import { useSelector, useDispatch } from "react-redux";
import { selectAfter, 
    selectLoading, 
    selectPosts, 
    getPosts,
    selectBefore } from "./postsSlice";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
    let after = useSelector(selectAfter);
    let before = useSelector(selectBefore);

    const handleLoadPosts = (e) => {
        e.preventDefault();
        dispatch(getPosts(subredditSelection, after));
    }

    const handleNextPage = (e) => {
        e.preventDefault();
        dispatch(getPosts({subreddit: subredditSelection, after: after}));
    }

    const handlePrevPage = (e) => {
        e.preventDefault();
        dispatch(getPosts({subreddit: subredditSelection, before: before}))
    }

    //dispatches getPosts action on first render and on route shift
    //utilizes useEffect hook per React demands and useLocation to 
    const firstRender = () => {
        //console.log(`fetching posts from r/${subredditSelection}...`);
        dispatch(getPosts({subreddit: subredditSelection, after: ''}));
    }

    useEffect(firstRender, [location]);
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