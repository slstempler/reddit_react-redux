import React, { useState } from "react";
import './thread.css';
import parse from 'html-react-parser';
import { parseSelfText, toggleCommentCollapse, selectContent } from "./threadSlice";
import { IconButton } from "@mui/material";
import UnfoldMore from "@mui/icons-material/UnfoldMore";
import UnfoldLess from "@mui/icons-material/UnfoldLess";
import { useDispatch, useSelector } from "react-redux";

export const Comment = ({commentData = {data: {replies: "", body: ""},}, threadLayer = 0}) => {
    const dispatch = useDispatch();

    //state selector for collapsable threads
    // const replyChains = useSelector(selectReplyChains);
    const threadContent = useSelector(selectContent);

    //simple variables for semantic clarity in handling content
    const hasReplies = commentData.data.replies ? true : false;
    const hasBody = commentData.data.body ? true : false;
    const commentID = commentData.data.id;
    const userIsOP = commentData.data.author === threadContent.author;
    
    let [showHide, setShowHide] = useState(true);
    //console.log(`comment ${commentID} status -  replies: ${hasReplies} body: ${hasBody}`);
    
    /* expandreplies logic
    const expandReplies = (parent, layer) => {
        // if there are replies, return [parent, expandReplies(parent)]
        if(hasReplies) {
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
    */

    //style toggle handler for comments collapsing
    const toggleCollapse = (e, element) => {
        e.preventDefault(); //prevents default
        e.target.classList.toggle('hide-replies'); //toggle THIS
        dispatch(toggleCommentCollapse(element)); //dispatches action
        //showReplies = e.target.classList.contains('hide-replies') ? false : true;
        //console.log(`show replies? ${showReplies}`);
        // e.target.innerHTML = e.target.classList.contains('hide-replies') ? '+' : '-'; //modify button if the replies are hidden
        //handling for hiding descendants
        document.getElementById(element).classList.toggle('collapse-replies');
        showHide ? setShowHide(false) : setShowHide(true);
        //document.getElementsByClassName("childOf-" + element).classList.toggle('thread-collapse');
    }
    
    return (
        <div key={commentID}
            id={commentID} 
            className={"comment-container layer-" + threadLayer.toString() 
                    + (threadLayer >= 1 ? " is-reply" : " top-level")
                    + (hasBody ? " no-hide" : " load-more")}>

            <IconButton onClick={(e) => {toggleCollapse(e, commentID)}}>
                 {showHide && <UnfoldLess className="comment-button" size='medium' ></UnfoldLess>}
                    {!showHide && <UnfoldMore className="comment-button" size='medium' ></UnfoldMore>}
            </IconButton>
            {hasBody &&
            <>
                <a href={"https://www.reddit.com/u/" + commentData.data.author}
                className={"comment-user " + (userIsOP ? "comment-OP" : "not-OP")}
                target="_blank" rel="noreferrer">{commentData.data.author}</a>
                {userIsOP && <span><strong><em> - OP</em></strong></span>}
                <span className="comment-body">{parse(parseSelfText(commentData.data.body))}</span>
                <br></br>
                <div className="comment-details">
                    <a href={"https://www.reddit.com" + commentData.data.permalink}>Permalink</a>
                    <span className="comment-score"> | {commentData.data.score} points</span>
                </div>
            </>
            }
            {/* if there are replies, recursively drill down through, mapping those out */}
            {hasReplies && commentData.data.replies.data.children.map(comment => {
                return <Comment commentData={comment} threadLayer={threadLayer+1} />}
            )}
        </div>
    )
}