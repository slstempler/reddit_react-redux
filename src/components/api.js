//used to get posts from designated subreddit
export const fetchPosts = (subreddit) => {
    const response = fetch(`https://www.reddit.com/r/${subreddit}.json`);
    return response;
}

//gets list of "popular" subreddits
export const fetchSubreddits = () => {
    const response = fetch(`https://www.reddit.com/subreddits/popular.json`);
    return response;
}

//gets data pulled from thread ID
export const fetchThread = ({subreddit, threadId}) => {
    console.log(`trying to fetch from https://www.reddit.com/r/${subreddit}/comments/${threadId}.json`);
    const response = fetch(`https://www.reddit.com/r/${subreddit}/comments/${threadId}.json`);
    return response;
}