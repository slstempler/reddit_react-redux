//used to get posts from designated subreddit
export const fetchPosts = (subreddit, after = '', before = '') => {
    if(!after && !before){
        const response = fetch(`https://www.reddit.com/r/${subreddit}.json?count=30`);
        return response;
    }
    else if(after){
        const response = fetch(`https://www.reddit.com/r/${subreddit}.json?count=30&limit=30&after=${after}`);
        return response;
    }
    else if(before){
        const response = fetch(`https://www.reddit.com/r/${subreddit}.json?count=30&limit=30&before=${before}`);
        return response;
    }
    
}

//gets list of "popular" subreddits
export const fetchSubreddits = () => {
    const response = fetch(`https://www.reddit.com/subreddits/popular.json`);
    return response;
}

//gets data pulled from thread ID
export const fetchThread = ({subreddit, threadId}) => {
    const response = fetch(`https://www.reddit.com/r/${subreddit}/comments/${threadId}.json`);
    return response;
}