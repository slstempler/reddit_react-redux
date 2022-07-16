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
    selectThreadContentType} from "./threadSlice";

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
    let videoEmbedPath = `https://www.redditmedia.com/r/${subreddit}/comments/${threadId}/?embed=true&theme=dark`;

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
                    {/* displays thread title at top of page */}
                    {threadContent &&
                        <p>{threadContent.title}</p>
                    }
                    {/* previews thumbnail when that is best option */}
                    {threadContent.thumbnail && 
                    !threadContent.media &&
                    !threadImagePath &&
                    threadContentType !== 'selftext' &&
                        <img src={threadContent.url} alt="thread url"></img>
                    }
                    {/* previews gallery when there is a gallery */}
                    {threadContentType === 'gallery' &&
                        <img src={threadImagePath} alt="gallery preview"></img>
                    }
                    {/* video workaround using reddit Embed, only when video flag is true */}
                    {threadContentType === 'video' &&
                        <iframe src={videoEmbedPath}
                                sandbox="allow-scripts allow-same-origin allow-popups"
                                style={{border: 'none'}}
                                height="400"
                                width="615"
                                scrolling="no"></iframe>}
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