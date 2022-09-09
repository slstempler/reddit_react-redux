import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPosts } from "../../components/api";

//action creator fetches posts from designated subreddit
export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async ({subreddit, after, before}, thunkAPI) => {
        console.log(`after: ${after} before: ${before}`);
        const response = await fetchPosts(subreddit, after, before);
        const json = await response.json();
        return json.data;
    }
)

/*
export const getThread = createAsyncThunk(
    'posts/getThread',
    async (threadData, thunkAPI) => {
        const response = await fetchThread(threadData);
        const json = await response.json();
        return json;
    }
)

//selects image path(s) for gallery preview from Thread json
const extractImages = (action) => {
    let imagePath = ''
    if(action.payload[0].data.children[0].data.media_metadata){
        console.log(`imagePath = ${imagePath}`)
        const galleryData = action.payload[0].data.children[0].data.media_metadata;
        let pathHolding = '';
        for(let key in galleryData){
            for(let size in galleryData[key].p){
                console.log(galleryData[key].p[size].u)
                pathHolding = galleryData[key].p[size].u;
            }
        }
        imagePath = pathHolding.replace(/&amp;/g, '&');
    }
    return imagePath;
}
*/

export const postsSlice = createSlice ({
    name: 'posts',
    initialState: {
        posts: [],
        isLoading: false,
        hasError: false,
        postsAfter: '',
        postsBefore: '',
        /*
        imagePath: '',
        thread: [],
        content: [],
        */
    },
    reducers: {
        updateThreadImage(state, action) {
            state.imagePath = action.payload;
        },
    },
    //promise lifecycle actions via createAsyncThunk to handle responses from API, setting state accordingly
    extraReducers: (builder) => {
        builder
            .addCase('posts/getPosts/pending', (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase('posts/getPosts/rejected', (state, action) => {
                console.log(`request denied.`);
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase('posts/getPosts/fulfilled', (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.posts = [];
                state.posts = (action.payload.children);
                state.postsAfter = action.payload.after;
                state.postsBefore = action.payload.before;
            })
            /*
            .addCase('posts/getThread/pending', (state, action) => {
                //console.log(`fetching thread...`);
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase('posts/getThread/rejected', (state, action) => {
                console.log(`thread fetching failed.`);
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase('posts/getThread/fulfilled', (state, action) => {
                //console.log(`successfully fetched thread data`);
                state.isLoading = false;
                state.hasError = false;
                state.thread = [];
                state.content = action.payload[0].data.children[0].data;
                state.thread = action.payload[1].data.children;
                state.imagePath = extractImages(action);
                //state.content.imagePath = action.payload[0].data.children[0].data.media_metadata;
            })
            */
    }
})

export const selectPosts = (state) => state.posts.posts; //posts selector, selects posts :)
export const selectLoading = state => state.posts.isLoading;
export const selectError = state => state.posts.hasError;
export const selectAfter = state => state.posts.postsAfter;
export const selectBefore = state => state.posts.postsBefore;
export default postsSlice.reducer;

/*
export const selectContent = state => state.posts.content;
export const selectThread = state => state.posts.thread;
export const selectImagePath = state => state.posts.imagePath;
export const {updateThreadImage} = postsSlice.actions;
*/