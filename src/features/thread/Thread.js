import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, 
        useNavigate, 
        useParams, 
        Link, 
        useSearchParams } from "react-router-dom";
import { selectAfter, selectBefore } from "../posts/postsSlice";
import { getThread, 
    selectThreadError, 
    selectThreadLoading, 
    selectThread, 
    selectContent,
    updateThreadImage, 
    selectThreadImagePath,
    selectThreadContentType,
    parseSelfText} from "./threadSlice";
import parse from 'html-react-parser';
import { Comment } from "./Comment";
import { Button } from "@mui/material";
import './thread.css'
import '../posts/posts.css'

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
    const threadContentType = useSelector(selectThreadContentType);
    const subredditPath = '/r/' + subreddit;
    const before = useSelector(selectBefore);
    const after = useSelector(selectAfter);

    /* URL QUERIES STUFF TO FIX
    //if there is an "after" value, use that to populate the return page
    let backToPostsPath = '';
    after ? backToPostsPath = subredditPath + '?after=' + after : backToPostsPath = subredditPath;
    */

    //used to populate img component attributes
    const threadImagePath = useSelector(selectThreadImagePath);
    let imagePath = ''
    let imageDoRender = false;
    
    // Other Elements
    let threadURL = "https://www.reddit.com" + threadContent.permalink;

    // Video Handling
    let videoEmbedPath = `https://www.redditmedia.com/r/${subreddit}/comments/${threadId}/?embed=true&theme=dark`;
    let videoEmbedWidth, videoEmbedHeight; 
    // if(threadContent.is_video){
    //     videoEmbedHeight = Math.floor(threadContent.media.reddit_video.height / 2.3);
    //     console.log(videoEmbedHeight);
    //     videoEmbedWidth = Math.floor(threadContent.media.reddit_video.width / 3.1);
    //     console.log(videoEmbedWidth)
    // }

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
    //resets scroll position in thread
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [location])
    
    

    //recursive function pulls relevant data out of top-level comments
    const expandReplies = (parent, layer, inheritId = 'none') => {
        // if there are replies, return [parent, expandReplies(parent)]
        if(parent) if(parent.data) if(parent.data.replies) {
            let childArray = [<p key={parent.data.id}
                                id={parent.data.id} 
                                className={"comment-replies " + "layer-" + layer + " childOf-" + inheritId}>
                            {<button onClick={(e) => {toggleCollapse(e, parent.data.id)}}>-</button>}
                            {parent.data.score} | {parse(parseSelfText(parent.data.body))}</p>];
            let searchPath = parent.data.replies.data.children; //sets JSON path for for...of
            for(let reply of searchPath) {
                // how to set the classes for all replies to make sense??
                childArray.push(expandReplies(reply, layer+1, inheritId)); //adds result of expandReplies to childArray
            }
            return childArray;
        }
        // if NO replies, return [parent]
        else {
            return [<p key={parent.data.id}
                    id={parent.data.id}
                    className={"comment-noreply " + "layer-" + layer + " childOf-" + inheritId}>
           {<button onClick={(e) => {toggleCollapse(e, parent.data.id)}}>-</button>}
           {parent.data.score} | {parse(parseSelfText(parent.data.body))}</p>];
        }
    }

    //style toggle handler for comments collapsing
    const toggleCollapse = (e, element) => {
        e.preventDefault();
        console.log(e.target);
        console.log(element);
        e.target.classList.toggle('hide-replies'); //toggle THIS
        e.target.innerHTML = e.target.classList.contains('hide-replies') && '+'; //modify button if the replies are hidden
        //handling for hiding descendants
        document.getElementById(element).classList.toggle('collapse-replies')
        document.getElementsByClassName("childOf-" + element).classList.toggle('thread-collapse');
    }

    // Copy Thread URL to Clipboard
    const clipboardThread = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(threadURL);
        alert("copied to clipboard!");
    }

    //returns post content + Comments components(?)
    if(threadData !== [] && !threadError && !threadLoading) { 
        return (
            <div className="thread-page">
                <Button type="button" variant="outlined" onClick={() => navigate("/" + threadContent.subreddit_name_prefixed)}
                    className="posts-pageNav">Back to {threadContent.subreddit_name_prefixed}</Button> 
                <Button type="button" variant="outlined" onClick={() => window.open(threadURL, "_blank")}
                    className="posts-pageNav">View on Reddit</Button>
                <Button type="button" variant="outlined" onClick={clipboardThread} 
                        className="posts-pageNav">Copy Thread Link</Button>
                <section className="thread-content">
                    {/* displays thread title at top of page */}
                    {threadContent &&
                        <h2>{threadContent.title}</h2>
                    }
                    {/* previews thumbnail when that is best option */}
                    {(threadContentType == 'other' || threadContentType == 'image' || threadContentType == 'gif') && 
                        <a href={threadContent.url} target="_blank"><img src={threadContent.url} alt="thread url"></img></a>
                    }
                    {/* previews gallery when there is a gallery */}
                    {threadContentType === 'gallery' &&
                        <a href={threadImagePath} target="_blank"><img src={threadImagePath} alt="gallery preview"></img></a>
                    }
                    {/* video workaround using reddit Embed, only when video flag is true */}
                    {threadContentType === 'video' &&
                    <>
                        
                        <iframe src={videoEmbedPath}
                                sandbox="allow-scripts allow-same-origin allow-popups"
                                style={{border: 'none'}}
                                height='476'
                                width='640'
                                scrolling="no"></iframe>
                    </>}
                    {threadContent.is_self &&
                            // code for attempt at pulling New Video Player links
                            // <iframe src={"https://reddit.com/link/" + threadContent.id + "/video/" + Object.keys(threadContent.media_metadata)[0] + "/player"}></iframe>
                            <span className="thread-selftext">{parse(parseSelfText(threadContent.selftext))}</span>
                    }
                </section>
                <section className="thread-comments">
                    {threadData.map(comment=> {
                        return <Comment commentData={comment} threadLayer={0}/>
                    })}
                   {/*
                   {threadData.map(comment => {
                        return <div key={comment.data.id + "-container"}>{expandReplies(comment, 0)}</div>
                    })}
                    
                    */}
                    {/* {threadData.map(comment => {
                        return <div key={comment.data.id}>{comment.data.score} | {parse(parseSelfText(comment.data.body))}</div>
                    })} */}
                </section>
                <Button type="button" variant="outlined" onClick={() => navigate("/" + threadContent.subreddit_name_prefixed)}
                    className="posts-pageNav">Back to {threadContent.subreddit_name_prefixed}</Button>
            </div>
        )} 
    else return (<p>Loading...</p>);
}