import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getThread, selectPosts, selectThread } from "../postsSlice";

export const Thread = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const subreddit = params.subreddit;
    const threadId = params.threadId;
    const threadData = useSelector(selectThread);
    //NEED TO WORK OUT FLOW HERE! CAN'T LOAD POSTS BEFORE POSTS LOAD..
    //const selectPosts = useSelector(selectPosts);

    //Effect function to dispatch action creator
    const renderThread = () => {
        dispatch(getThread({subreddit: subreddit, threadId: threadId}));
    }

    //useEffect pulls thread data on first render, fires on location change
    useEffect(renderThread, [location]);

    //returns post content + Comments components
    return (
        <section className="thread-comments">
            <p>====THREAD COMMENTS BELOW=====</p>
            <p>{threadData[0].data.score} | {threadData[0].data.body}</p>
            <p>{threadData[1].data.score} | {threadData[1].data.body}</p>
            <p>{threadData[2].data.score} | {threadData[2].data.body}</p>
            <p>{threadData[3].data.score} | {threadData[3].data.body}</p>
        </section>
    );
}