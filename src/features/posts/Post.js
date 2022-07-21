import React from "react";
import { Link } from "react-router-dom";
import "./posts.css"

export const Post = ({postData}) => {
    const postUrl = `http://www.reddit.com/r/${postData.subreddit}/${postData.id}`;
    const routeUrl = `/r/${postData.subreddit}/comments/${postData.id}`;
    let thumbUrl;
    if(postData.thumbnail_height) thumbUrl = postData.thumbnail;
    //console.log(postData.title);
    //console.log(postData);
    return (
        // Post HAS thumbnail
        // Post does NOT have thumbnail
        // Post is NSFW
        // Post is a Spoiler
        <div className="posts-post">
            {thumbUrl && thumbUrl !== 'spoiler' && thumbUrl !== 'nsfw' && <img src={thumbUrl}></img>}
            {thumbUrl === 'spoiler' && <h5>Shh... Link is a Spoiler!</h5>}
            {thumbUrl === 'nsfw' && <h5>Hmmm... Link is NSFW</h5>}
            <br/>
            <p className="posts-post-score">{postData.score} | </p><a href={postUrl} className="posts-post-link">{postData.title}</a>
            <Link className="posts-post-thread" to={routeUrl}>Go to Thread</Link>
        </div>
    );
}