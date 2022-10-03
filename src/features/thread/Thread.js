import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, 
        useNavigate, 
        useParams } from "react-router-dom";
import { getThread, 
    selectThreadError, 
    selectThreadLoading, 
    selectThread, 
    selectContent,
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

    /* URL QUERIES STUFF TO FIX
    //if there is an "after" value, use that to populate the return page
    let backToPostsPath = '';
    after ? backToPostsPath = subredditPath + '?after=' + after : backToPostsPath = subredditPath;
    */

    //used to populate img component attributes
    const threadImagePath = useSelector(selectThreadImagePath);
    const previewImagePath = threadContent.preview && threadContent.preview.images[0].source.url.replace(/&amp;/g, '&'); //sets thread preview image to source img, only if one is available
    
    // Other Elements
    let threadURL = "https://www.reddit.com" + threadContent.permalink;

    // Video Handling
    let videoEmbedPath = `https://www.redditmedia.com/r/${subreddit}/comments/${threadId}/?embed=true&theme=dark`;

    //Effect function to dispatch action creator 
    const renderThread = () => {
        dispatch(getThread({subreddit: subreddit, threadId: threadId}));
    }

    //useEffect pulls thread data on first render, fires on location change
    // React-Redux flow interfering with linter prefs per https://github.com/facebook/create-react-app/issues/6880 - requires rework of logic
    // eslint-disable-next-line
    useEffect(renderThread, [location]);

    //useEffect(extractImages, [location, imagePath]);
    //resets scroll position in thread
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [location]);

    //updates tab title to reflect title of thread
    useEffect(() => {document.title = threadContent.title + " | RE:ddit"}, [threadContent]);

    // Copy Thread URL to Clipboard
    const clipboardThread = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(threadURL);
        alert("copied to clipboard!");
    }

    // Toggles CSS on main content to reveal NSFW/Spoilers
    const revealContent = (e) => {
        e.preventDefault();
        document.getElementById('thread-content').classList.remove('content-hide');
        document.getElementById('thread-screen-container').style.display = 'none';
    }

    //returns post content + Comments components(?)
    if(threadData !== [] && !threadError && !threadLoading) { 
        return (
            <div className="thread-page">
                <div className="thread-nav">
                    <Button type="button" variant="outlined" onClick={() => navigate("/" + threadContent.subreddit_name_prefixed)}
                        className="posts-pageNav thread-nav-button">Back to {threadContent.subreddit_name_prefixed}</Button> 
                    <Button type="button" variant="outlined" onClick={() => window.open(threadURL, "_blank")}
                        className="posts-pageNav thread-nav-button">View on Reddit</Button>
                    <Button type="button" variant="outlined" onClick={clipboardThread} 
                            className="posts-pageNav thread-nav-button">Copy Thread Link</Button>
                </div>
                {(threadContent.spoiler || threadContent.over_18) &&
                    <section className="thread-screen-container" id='thread-screen-container'>
                        <Button type="button" variant="outlined" 
                        onClick={revealContent}
                        className="posts-pageNav thread-nav-button ">
                            Click to Reveal {threadContent.over_18 && "NSFW"}{threadContent.spoiler && "Spoiler"} Content</Button>
                    </section>
                }
                <section id="thread-content" className={"thread-content " + ((threadContent.spoiler || threadContent.over_18) && "content-hide")}>
                    {/* displays thread title at top of page */}
                    {threadContent &&
                        <h2 className="thread-title">{threadContent.title}</h2>
                    }
                    {/* previews thumbnail when that is best option */}
                    {(threadContentType === 'image' || threadContentType === 'gif') && 
                        <a href={threadContent.url} target="_blank" rel="noreferrer"><img src={threadContent.url} alt="thumbnail preview for thread"></img></a>
                    }
                    {/* when thread previews from an external link */}
                    {(threadContentType === 'other') &&
                        <a href={threadContent.url} target="_blank" rel="noreferrer"><img src={previewImagePath} alt="thread media"></img></a>
                    }
                    {/* previews gallery when there is a gallery */}
                    {threadContentType === 'gallery' &&
                        <a href={threadImagePath} target="_blank" rel="noreferrer"><img src={threadImagePath} alt="preview from gallery submission"></img></a>
                    }
                    {/* video workaround using reddit Embed, only when video flag is true */}
                    {threadContentType === 'video' &&
                    <>
                        
                        <iframe src={videoEmbedPath}
                                sandbox="allow-scripts allow-same-origin allow-popups"
                                style={{border: 'none'}}
                                scrolling="yes"
                                title="Reddit Video Embed"
                                className="thread-direct-embed"></iframe>
                    </>}
                    {/* selftext w/o image embed */}
                    {threadContent.is_self && !threadContent.media_metadata && !threadContent.preview && 
                            <div className="thread-selftext">{parse(parseSelfText(threadContent.selftext))}</div>
                    }
                    {/* covers selftext w/image embed */}
                    {threadContent.is_self && threadContent.media_metadata &&
                        <>
                            <img src={threadContent.media_metadata[Object.keys(threadContent.media_metadata)[0]].s.u.replace(/&amp;/g, '&')}
                                alt="self-text post"></img>
                            <div className="thread-selftext">{parse(parseSelfText(threadContent.selftext))}</div>
                        </>
                    }
                    {/* selftext w/image preview */}
                    {threadContent.is_self && !threadContent.media_metadata && threadContent.preview &&
                        <>
                            <img src={threadContent.preview.images[0].source.url.replace(/&amp;/g, '&')}
                                alt="self-text post"></img>
                            <div className="thread-selftext">{parse(parseSelfText(threadContent.selftext))}</div>
                        </>
                    }
                </section>
                <section className="thread-comments">
                    <h3>{threadContent.num_comments} Comments</h3>
                    {threadData.map(comment=> {
                        return <Comment commentData={comment} threadLayer={0} key={comment.data.id}/>
                    })}
                </section>
                <Button type="button" variant="outlined" onClick={() => navigate("/" + threadContent.subreddit_name_prefixed)}
                    className="posts-pageNav">Back to {threadContent.subreddit_name_prefixed}</Button>
            </div>
        )} 
    else return (<p>Loading...</p>);
}