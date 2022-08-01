import React from "react";
import './thread.css';
import parse from 'html-react-parser';
import { parseSelfText } from "./threadSlice";

export const Comment = ({commentData = {data: {replies: "", body: ""},}, threadLayer = 0}) => {
    const hasReplies = commentData.data.replies ? true : false;
    const hasBody = commentData.data.body ? true : false;
    console.log(`comment ${commentData.data.id} status -  replies: ${hasReplies} body: ${hasBody}`);
    
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
        e.preventDefault();
        console.log(e.target);
        console.log(element);
        e.target.classList.toggle('hide-replies'); //toggle THIS
        e.target.innerHTML = e.target.classList.contains('hide-replies') ? '+' : '-'; //modify button if the replies are hidden
        //handling for hiding descendants
        document.getElementById(element).classList.toggle('collapse-replies')
        //document.getElementsByClassName("childOf-" + element).classList.toggle('thread-collapse');
    }
    
    return (
        <div key={commentData.data.id}
            id={commentData.data.id} 
            className={"comment-container " + "layer-" + threadLayer.toString() 
                    + (threadLayer >= 1 ? " is-reply" : " top-level")
                    + (hasBody ? " no-hide" : " load-more")}>
            {hasBody && 
            <>
                <button onClick={(e) => {toggleCollapse(e, commentData.data.id)}}>-</button>
                <br></br>
                <span className="comment-body">{hasBody && parse(parseSelfText(commentData.data.body))}</span>
                <br></br>
                <a href={"https://www.reddit.com" + commentData.data.permalink}>Permalink</a>
                <span> {commentData.data.id}</span>
            </>
            }
            {/* if there are replies, recursively drill down through, mapping those out */}
            {hasReplies && commentData.data.replies.data.children.map(comment => {
                return <Comment commentData={comment} threadLayer={threadLayer+1} />}
            )}
        </div>
    )
}