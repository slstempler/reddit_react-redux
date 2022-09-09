import React from "react";
import { useNavigate } from "react-router-dom";
import "./posts.css"
import PlayCircle from '@mui/icons-material/PlayCircle'
import { Button } from "@mui/material";

export const Post = ({postData}) => {
    const postUrl = `http://www.reddit.com/r/${postData.subreddit}/${postData.id}`;
    const routeUrl = `/r/${postData.subreddit}/comments/${postData.id}`;
    let thumbUrl;
    if(postData.thumbnail) thumbUrl = postData.thumbnail;
    let navigate = useNavigate()
    let postTypeFlag, postHideFlag;

    // returns image for Card
    const findfirstGalleryImageUrl = (obj) => {
        const imageKeys = Object.keys(obj);
        const firstImageKey = imageKeys[0];
        let firstImageObj = obj[firstImageKey];
        let unparsedUrl = firstImageObj.p[firstImageObj.p.length-1].u;
        return unparsedUrl.replace(/&amp;/g, '&');
    }
    // returns video thumbnail for Card
    const findPreviewThumbnail = () => {
        return postData.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    

    // event handler for Go To Thread button
    const navToThread = (e) => {
        e.preventDefault();
        navigate(routeUrl);
    }

    // Categorizes post to handling rendering
    
    if(postData.is_video){
        postTypeFlag = 'video';
    }
    else if(postData.is_gallery){
        postTypeFlag = 'gallery';
    }
    else if(postData.domain === 'i.redd.it' && (postData.preview || postData.media_metadata)){
        postTypeFlag = 'directMedia';
    }
    else if(postData.is_self){
        if(!postData.preview && !postData.media_metadata){
            postTypeFlag = 'self-noMedia';
        }
        else if(postData.media_metadata) {
            if(postData.media_metadata[Object.keys(postData.media_metadata)[0]].e === 'RedditVideo'){
                postTypeFlag = 'self-redditVideo';
            }
            else{
                postTypeFlag = 'self-withMedia';
            }
        }
        else {
            postTypeFlag = 'self-other';
        }
    }
    else if(postData.preview){
        postTypeFlag = 'link-preview';
    }
    else {
        postTypeFlag = 'other-noPreview';
    }

    if(postData.spoiler){
        postHideFlag = 'spoiler'
    }
    else if(postData.over_18){
        postHideFlag = 'nsfw'
    }
    
    return (
        <div className="posts-post" onClick={navToThread}>
            <div className="posts-topBar">
                <span className="posts-post-score">{postData.score}</span>
                <a href={"https://www.reddit.com/u/" + postData.author} 
                className="posts-post-user">{postData.author}</a>
            </div>
        
        {console.log(`${postData.title} is ${postTypeFlag}`)}
        {/* Post is A VIDEO */}
            {postTypeFlag === 'video' && !postHideFlag &&
                <>
                    <div className="vid-thumb-container">
                        <PlayCircle className="vid-thumb-icon" fontSize="36"/>
                        <img src={findPreviewThumbnail()} alt="thumbnail preview for video post" className="posts-vid-thumbnail"></img>
                    </div>
                    <a href={postUrl} className="posts-post-link">{postData.title}</a>
                </>
            }
        {/* Post IS a gallery or selftext with media */}
            {(postTypeFlag === 'gallery' || postTypeFlag === 'self-withMedia') && !postHideFlag &&
            // (postData.is_gallery || (postData.is_self && postData.media_metadata)) &&
            // (thumbUrl && thumbUrl !== 'nsfw' && thumbUrl !== 'spoiler') && 
            // !postData.is_video &&
                <>
                    <img src={findfirstGalleryImageUrl(postData.media_metadata)} alt="gallery or mixed text-media post" className="posts-post-thumbnail"></img>
                    <a href={postUrl} className="posts-post-link">{postData.title}</a>
                </>
            }
        {/* Post is NOT a gallery & is a direct image link */}
            {postTypeFlag === 'directMedia' && !postHideFlag &&
            // thumbUrl && thumbUrl !== 'spoiler' && thumbUrl !== 'nsfw' && !postData.is_gallery && !postData.is_video && postData.domain === 'i.redd.it' &&
                <>
                    <img src={postData.url} alt="post preview - direct submission" className="posts-post-thumbnail"></img>
                    <a href={postUrl} className="posts-post-link">{postData.title}</a>
                </>
            }
        {/* Post is a link, NOT a video, and NOT an image link - includes selftext w/image embeds */}
            {(postTypeFlag === 'self-other' || postTypeFlag === 'link-preview') && !postHideFlag &&
            /* {postData.domain !== 'i.redd.it' && postData.preview && !postData.is_video &&
            (thumbUrl && thumbUrl !== 'nsfw' && thumbUrl !== 'spoiler') &&  */
                <>
                    <img src={findPreviewThumbnail()} alt="post preview - text submission" className="posts-link-thumbnail"></img>
                    <a href={postUrl} className="posts-post-link">{postData.title}</a>
                </>
            }
        {/* Post does NOT have thumbnail */}
            {(postTypeFlag === 'self-noMedia' || postTypeFlag === 'other-noPreview' || postHideFlag || postTypeFlag === 'self-redditVideo') &&
            /* {((!thumbUrl || thumbUrl === 'nsfw' || thumbUrl === 'spoiler')) && */
                <>
                    {thumbUrl === 'nsfw' &&  
                        <h5 className="posts-post-nsfw">[NSFW]</h5>
                    }
                    {thumbUrl === 'spoiler' && 
                        <h5 className="posts-post-spoiler">[SPOILER]</h5>
                    }
                    <a href={postUrl} className="posts-post-nothumb posts-post-link">{postData.title}</a>               
                </>
            }
            <div className="posts-post-threadTray">
                <Button type="button" variant="outlined" onClick={navToThread} className="posts-post-thread thread-text">Go To Thread</Button>
                <Button type="button" variant="text" onClick={navToThread} className="posts-post-numComments thread-text">{postData.num_comments} Comments</Button>
            </div>
        </div>
    );
}