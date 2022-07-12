import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSubreddits } from "../../components/api";

//action creator dispatches initial fetch and parses
export const getSubreddits = createAsyncThunk(
    'subreddits/getSubreddits',
    async (thunkAPI) => {
        const response = await fetchSubreddits();
        const json = await response.json();
        return json.data.children;
    }
)

export const subredditsSlice = createSlice({
    name: 'subreddits',
    initialState: {
        subreddits: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase('subreddits/getSubreddits/pending', (state, action) => {
                console.log(`pending subs...`);
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase('subreddits/getSubreddits/rejected', (state, action) => {
                console.log(`request failed.`);
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase('subreddits/getSubreddits/fulfilled', (state, action) => {
                console.log(`subreddits fetch successful!`);
                state.isLoading = false;
                state.hasError = true;
                state.subreddits = action.payload;
                console.log(state.subreddits);
            })
    }
})


export const selectSubreddits = state => state.subreddits.subreddits;
export const selectSubLoading = state => state.subreddits.isLoading;
export const selectSubError = state => state.subreddits.hasError;
export default subredditsSlice.reducer;