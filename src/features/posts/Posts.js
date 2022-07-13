import { useSelector, useDispatch } from "react-redux";
import { selectLoading, selectPosts } from "./postsSlice";
import { Link, useLocation, useParams } from "react-router-dom";
import { addPosts, getPosts } from "./postsSlice";
import { Post } from "./Post";
import { useEffect, useState } from "react";



export const Posts = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectPosts);
    const arePostsLoaded = useSelector(selectLoading);
    const params = useParams();
    const subredditSelection = params.subreddit;
    const location = useLocation();

    const handleLoadPosts = (e) => {
        e.preventDefault();
        dispatch(getPosts(subredditSelection));
    }

    //dispatches getPosts action on first render and on route shift
    //utilizes useEffect hook per React demands and useLocation to 
    const firstRender = () => {
        //console.log(`fetching posts from r/${subredditSelection}...`);
        dispatch(getPosts(subredditSelection));
    }

    useEffect(firstRender, [location]);

    return (
        <section className="posts">
            {arePostsLoaded && <p>Loading...</p>}
            {posts.map(post => {
                //console.log(post);
                return <Post postData={post.data} key={post.data.id}/>
            })}
        
        </section>
    );
}