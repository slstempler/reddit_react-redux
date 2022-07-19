import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchThread } from "../../components/api";

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
    //let stringTest = "[payload][0][data][children][0][data][media_metadata]";
    if(action.payload[0].data.children[0].data.media_metadata){
        console.log(`imagePath = ${imagePath}`)
        const galleryData = action.payload[0].data.children[0].data.media_metadata;
        let pathHolding = '';
        for(let key in galleryData){
            for(let size in galleryData[key].p){
                let path = galleryData[key].p
                pathHolding = path[size].u;
            }
        }
        imagePath = pathHolding.replace(/&amp;/g, '&');
    }
    return imagePath;
}

//runs through action payload JSON to indicate relevant flags for rendering
const parseThreadData = (action) => {

}
 
export const threadSlice = createSlice({
    name: 'thread',
    initialState: {
        thread: [],
        content: [],
        isLoading: false,
        hasError: false,
        imagePath: '',
        contentType: ''
    },
    reducers: {
        updateThreadImage(state, action) {
            state.imagePath = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
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
                state.isLoading = false;
                state.hasError = false;
                state.thread = [];
                state.content = action.payload[0].data.children[0].data;
                state.thread = action.payload[1].data.children;
                state.imagePath = extractImages(action);
                if(state.content.is_video){
                    state.contentType = 'video';
                }
                else if(state.content.is_self){
                    state.contentType = 'selftext';
                }
                else if(state.content.is_gallery){
                    state.contentType = 'gallery';
                }
                else if(state.content.url.includes('.gif')){
                    state.contentType = 'gif';
                }
                else if(state.content.post_hint == 'image' ||
                        state.content.domain == 'i.redd.it' ||
                        state.content.url.includes('.png') || state.content.url.includes('.jpg')){
                    state.contentType = 'image'
                }
                else if(state.content.is_reddit_media_domain && state.content.domain==="i.redd.it"){
                    state.contentType = 'imageUpload';
                }
                else{
                    state.contentType = 'other';
                }
            })
    }
})

export const selectThreadLoading = state => state.thread.isLoading;
export const selectThreadError = state => state.thread.hasError;
export const selectContent = state => state.thread.content;
export const selectThread = state => state.thread.thread;
export const selectThreadImagePath = state => state.thread.imagePath;
export const selectThreadContentType = state => state.thread.contentType;
export const {updateThreadImage} = threadSlice.actions;
export default threadSlice.reducer;