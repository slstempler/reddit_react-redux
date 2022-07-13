import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPosts, fetchThread } from "../../components/api";

//action creator fetches posts from designated subreddit
export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async (subreddit, thunkAPI) => {
        const response = await fetchPosts(subreddit);
        const json = await response.json();
        return json.data.children;
    }
)

export const getThread = createAsyncThunk(
    'posts/getThread',
    async (threadData, thunkAPI) => {
        const response = await fetchThread(threadData);
        const json = await response.json();
        return json;
    }
)

export const postsSlice = createSlice ({
    name: 'posts',
    initialState: {
        posts: [],
        thread: [],
        content: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
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
                state.posts = (action.payload);
            })
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
            })
    }
})

export const selectPosts = (state) => state.posts.posts; //posts selector, selects posts :)
export const selectLoading = state => state.posts.isLoading;
export const selectError = state => state.posts.hasError;
export const selectThread = state => state.posts.thread;
export const selectContent = state => state.posts.content;
export const {addPosts} = postsSlice.actions;
export default postsSlice.reducer;