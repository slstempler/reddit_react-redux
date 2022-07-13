import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { getThread, selectError, selectLoading, getPosts, selectThread, selectContent } from "../postsSlice";

export const Thread = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const subreddit = params.subreddit;
    const threadId = params.threadId;
    const threadData = useSelector(selectThread);
    const threadError = useSelector(selectError);
    const threadLoading = useSelector(selectLoading);
    const threadContent = useSelector(selectContent);
    const subredditPath = '/r/' + subreddit;
    let imagePath = ''
    let imageDoRender = false;
    //NEED TO WORK OUT FLOW HERE! CAN'T LOAD POSTS BEFORE POSTS LOAD..
    //const selectPosts = useSelector(selectPosts);

    //Effect function to dispatch action creator
    const renderThread = () => {
        dispatch(getThread({subreddit: subreddit, threadId: threadId}));
    }

    //obtains image path from reddit gallery
    const extractImages = () => {
        if(threadData && !threadError && !threadLoading){
            const galleryData = threadContent.media_metadata;
            console.log(galleryData)
            for(let key in galleryData){
                for(let size in galleryData[key].p){
                    imagePath = galleryData[key].p[size].u;
                }
            }
            imagePath = imagePath.replace(/&amp;/g, '&');
        }
        else {console.log(`awaiting thread data...`)};
    }

    //useEffect pulls thread data on first render, fires on location change
    useEffect(renderThread, [location]);
    useEffect(extractImages, [location, threadData]);
  

    //returns post content + Comments components(?)
    if(threadData !== [] && !threadError && !threadLoading) { 
        return (
            <div>
                <Link to={subredditPath}>Back to subreddit!</Link>
                <section className="thread-content">
                    <p>=====THREAD CONTENT HERE======</p>
                    {threadContent.thumbnail && threadContent.thumbnail !== "self" &&
                        <img src={threadContent.url} alt="thread thumbnail"></img>
                    }
                    {//what went wrong?? not rendering bc...??? 
                        <img src={imagePath} alt="gallery preview"></img>
                    }
                </section>
                <section className="thread-comments">
                    <p>====THREAD COMMENTS BELOW====</p>
                    {threadData.map(comment => {
                        return <p key={comment.data.id}>{comment.data.score} | {comment.data.body}</p>
                    })}
                </section>
            </div>
        )} 
    else return (<p>Loading...</p>);
}