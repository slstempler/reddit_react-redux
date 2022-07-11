import React from "react";

export const Post = ({postData}) => {
    const postUrl = `http://www.reddit.com/r/${postData.subreddit}/${postData.id}`
    let thumbUrl;
    if(postData.thumbnail_height) thumbUrl = postData.thumbnail;
    //console.log(postData.title);
    //console.log(postData);
    return (
        <div>
            {thumbUrl && thumbUrl !== 'spoiler' && thumbUrl !== 'nsfw' && <img src={thumbUrl}></img>}
            {thumbUrl === 'spoiler' && <h5>Shh... Link is a Spoiler!</h5>}
            {thumbUrl === 'nsfw' && <h5>Hmmm... Link is NSFW</h5>}
            <p>{postData.title}</p>
            <a href={postUrl}>www.reddit.com/r/{postData.subreddit}/{postData.id}</a>
            <p>====================</p>
        </div>
    );
}