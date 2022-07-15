import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { getThread, 
    selectThreadError, 
    selectThreadLoading, 
    selectThread, 
    selectContent,
    updateThreadImage, 
    selectThreadImagePath} from "./threadSlice";

export const Thread = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const subreddit = params.subreddit;
    const threadId = params.threadId;
    const threadData = useSelector(selectThread);
    const threadError = useSelector(selectThreadError);
    const threadLoading = useSelector(selectThreadLoading);
    const threadContent = useSelector(selectContent);
    const subredditPath = '/r/' + subreddit;
    const threadImagePath = useSelector(selectThreadImagePath);
    let imagePath = ''
    let imageDoRender = false;
    //NEED TO WORK OUT FLOW HERE! CAN'T LOAD POSTS BEFORE POSTS LOAD..
    //const selectPosts = useSelector(selectPosts);

    //Effect function to dispatch action creator
    const renderThread = () => {
        dispatch(getThread({subreddit: subreddit, threadId: threadId}));
        //extractImages();
    }

    //obtains image path from reddit gallery
    const extractImages = () => {
        console.log(`imagePath = ${imagePath}`)
        if(threadImagePath && !threadError && !threadLoading){
            const galleryData = threadContent.media_metadata;
            let pathHolding = '';
            for(let key in galleryData){
                for(let size in galleryData[key].p){
                    console.log(galleryData[key].p[size].u)
                    pathHolding = galleryData[key].p[size].u;
                }
            }
            imagePath = pathHolding.replace(/&amp;/g, '&');
            console.log(imagePath)
            dispatch(updateThreadImage(imagePath));
        }
        else {console.log(`awaiting thread data...`)};
    }

    //useEffect pulls thread data on first render, fires on location change
    useEffect(renderThread, [location]);
    //useEffect(extractImages, [location, imagePath]);
  

    //returns post content + Comments components(?)
    if(threadData !== [] && !threadError && !threadLoading) { 
        return (
            <div>
                <Link to={subredditPath}>Back to subreddit!</Link>
                <section className="thread-content">
                    <p>=====THREAD CONTENT HERE======</p>
                    {threadContent &&
                        <p>{threadContent.title}</p>
                    }
                    {threadContent.thumbnail && 
                    threadContent.thumbnail !== "self" &&
                    !threadContent.media &&
                    !threadImagePath &&
                        <img src={threadContent.url} alt="thread url"></img>
                    }
                    {threadImagePath &&
                        <img src={threadImagePath} alt="gallery preview"></img>
                    }
                    {threadContent.is_self &&
                        <p>{threadContent.selftext}</p>
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