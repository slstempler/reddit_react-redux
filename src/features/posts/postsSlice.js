import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPosts } from "../../components/api";

//action creator fetches posts from designated subreddit
export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async (subreddit, thunkAPI) => {
        const response = await fetchPosts(subreddit);
        const json = await response.json();
        return json.data.children;
    }
)

export const postsSlice = createSlice ({
    name: 'posts',
    initialState: {
        posts: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    //promise lifecycle actions via createAsyncThunk to handle responses from API, setting state accordingly
    extraReducers: {
        [getPosts.pending](state, action) {
            console.log();
            state.isLoading = true;
            state.hasError = false;
        },
        [getPosts.rejected](state, action) {
            console.log(`request denied.`);
            state.isLoading = false;
            state.hasError = true;
        },
        [getPosts.fulfilled](state, action) {
            state.isLoading = false;
            state.hasError = false;
            state.posts = [];
            state.posts = (action.payload);
        }
    }
})

export const selectPosts = (state) => state.posts.posts; //posts selector, selects all posts in state
export const selectLoading = state => state.posts.isLoading;
export const selectError = state => state.posts.hasError;
export const {addPosts} = postsSlice.actions;
export default postsSlice.reducer;