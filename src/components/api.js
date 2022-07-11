//used to get posts from designated subreddit
export const fetchPosts = (subreddit) => {
    const response = fetch(`https://www.reddit.com/r/${subreddit}.json`);
    return response;
}
