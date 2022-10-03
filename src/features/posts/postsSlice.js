import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPosts } from "../../components/api";

//action creator fetches posts from designated subreddit
export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async ({subreddit, after, before}, thunkAPI) => {
        // console.log(`after: ${after} before: ${before}`);
        const response = await fetchPosts(subreddit, after, before);
        const json = await response.json();
        return json.data;
    }
)


export const postsSlice = createSlice ({
    name: 'posts',
    initialState: {
        posts: [],
        isLoading: false,
        hasError: false,
        postsAfter: '',
        postsBefore: '',
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
    }
})

export const selectPosts = (state) => state.posts.posts;
export const selectLoading = state => state.posts.isLoading;
export const selectError = state => state.posts.hasError;
export const selectAfter = state => state.posts.postsAfter;
export const selectBefore = state => state.posts.postsBefore;
export default postsSlice.reducer;