import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./posts.css"

export const Post = ({postData}) => {
    const postUrl = `http://www.reddit.com/r/${postData.subreddit}/${postData.id}`;
    const routeUrl = `/r/${postData.subreddit}/comments/${postData.id}`;
    let thumbUrl;
    if(postData.thumbnail_height) thumbUrl = postData.thumbnail;
    let navigate = useNavigate()

    // returns image for Card
    const findfirstGalleryImageUrl = (obj) => {
        const imageKeys = Object.keys(obj);
        const firstImageKey = imageKeys[0];
        let firstImageObj = obj[firstImageKey];
        let unparsedUrl = firstImageObj.p[firstImageObj.p.length-1].u;
        return unparsedUrl.replace(/&amp;/g, '&');
    }

    // event handler for Go To Thread button
    const navToThread = (e) => {
        e.preventDefault();
        navigate(routeUrl);
    }

    //console.log(postData.title);
    //console.log(postData);
    return (
        <div className="posts-post" onClick={navToThread}>
        {/* Post is NOT a gallery */}
            {thumbUrl && thumbUrl !== 'spoiler' && thumbUrl !== 'nsfw' && !postData.is_gallery &&
                <>
                    <span className="posts-post-score">{postData.score}</span>
                    <img src={postData.url}></img>
                    <a href={postUrl} className="posts-post-link">{postData.title}</a>
                    <button type="button" onClick={navToThread} className="posts-post-thread">Go To Thread</button> 
                </>
            }
        {/* Post IS a gallery */}
            {postData.is_gallery && thumbUrl !== 'nsfw' && thumbUrl !== 'spoiler' &&
                <>
                    <span className="posts-post-score">{postData.score}</span>
                    <img src={findfirstGalleryImageUrl(postData.media_metadata)}></img>
                    <a href={postUrl} className="posts-post-link">{postData.title}</a>
                    <button type="button" onClick={navToThread} className="posts-post-thread">Go To Thread</button> 
                </>
            }
        {/* Post does NOT have thumbnail */}
            {(!thumbUrl || thumbUrl === 'nsfw' || thumbUrl === 'spoiler') &&
                <>
                    <span className="posts-post-score">{postData.score}</span>
                    {thumbUrl === 'nsfw' &&  
                        <h5 className="posts-post-nsfw">Hmmm... Link is NSFW</h5>
                    }
                    {thumbUrl === 'spoiler' && 
                        <h5 className="posts-post-spoiler">Shh... Link is a Spoiler!</h5>
                    }
                    <a href={postUrl} className="posts-post-nothumb">{postData.title}</a>
                    <button type="button" onClick={navToThread} className="posts-post-thread">Go To Thread</button>                
                </>
            }
        </div>
    );
}