import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
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

const extractReplies = (parent, layer, ancestor = '') => {
    // if there are replies, return [parent, expandReplies(parent)]
    if(parent.data.replies) {
        let childArray = [{id: parent.data.id,
                        depth: parent.data.depth,
                        author: parent.data.author,
                        score: parent.data.score,
                        body: parent.data.body,
                        permalink: parent.data.permalink,
                        parentid: ancestor,
                        showReplies: true}, []]
        let searchPath = parent.data.replies.data.children; //sets JSON path for for...of
        for(let reply of searchPath) {
            childArray[1].push(extractReplies(reply, layer+1, parent.data.id)); //adds result of expandReplies to childArray
        }
        return childArray;
    }
    // if NO replies, return [parent]
    else {
        return {id: parent.data.id,
            depth: parent.data.depth,
            author: parent.data.author,
            score: parent.data.score,
            body: parent.data.body,
            permalink: parent.data.permalink,
            parentid: ancestor,
            showReplies: true}
    }
}
const replySearcher = (array, commentId) => {
    //look through objects, if id matches commentId, swap the ShowReplies flag
    for(let comment of array){
        //if an object, this is an actual comment - search for match
        if(typeof current(comment) === 'object'){
            //swap if a match!
            if(comment.id === commentId){
                console.log(`located!`);
                comment.showReplies = comment.showReplies ? false : true;
            }
            else {
                continue;
            }
        }
        //if an array, this contains replies - keep digging lower
        else if(typeof comment === 'array'){
            console.log(`array found!`);
            replySearcher(comment, commentId);
        }
    }
}

//checks text for regex pattern, replaces all matches with replacer function
//function looks for square bracket opening and closing paren
//replaces matched text with an anchor element with relevant body and link attribute
export const parseSelfText = (text = '') => {
    let replaceAnchor = '<a href=""></a>';
    let finalText = text;
    const linebreakRegex = /(---|----)/gmi;
    const headingRegex = /###.*/gmi;
    const boldRegex = /\*\*.*\*\*/gmi;
    const bulletRegex = /^(\*|-) /gmi;

    

    //console.log(text);
    if(finalText.match(/\[(.*?)\)/gm,)) {
        console.log(`found reddit markdown: ${finalText}`)
        finalText = finalText.replace(/\[(.*?)\)/gm, (match) => {
            
            let replacerText = match.slice(match.indexOf('[')+1, match.indexOf(']'));
            let replacerLink = match.slice(match.indexOf('(')+1, match.indexOf(')'))
            if(replacerLink){
                replacerLink = replacerLink.replace(/&amp;/g, '&');
                replaceAnchor = `<a href="${replacerLink}">${replacerText}</a>`;
                
                return replaceAnchor;
            }
        });
    }
    // if we do NOT see reddit markdown, attempt generic replace w/regex: 
    else {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return finalText.replace(urlRegex, match => {
                return `<a href=${match}>${match}</a>`;
            });
    }

    finalText = finalText.replace(linebreakRegex, (match) => {
        console.log(`found match ${match}!`);
        return "<br><hr><br>";
    });

    finalText = finalText.replace(headingRegex, (match) => {
        console.log(`heading: ${match}`);
        let noMarkdown = match.slice(3); //removes ###
        return `<h3>${noMarkdown}</h3>`;
    });

    finalText = finalText.replace(boldRegex, match => {
        let noMarkdown = match.slice(2, match.length-2);
        return `<strong>${noMarkdown}</strong>`;
    });

    finalText = finalText.replace(bulletRegex, match => {
        let noMarkdown = match.slice(1);
        return `&#x2022; ${noMarkdown}`;
    });

    return finalText;
}
 
export const threadSlice = createSlice({
    name: 'thread',
    initialState: {
        thread: [],
        content: [],
        isLoading: false,
        hasError: false,
        imagePath: '',
        contentType: '',
        replyChains: [],
    },
    reducers: {
        updateThreadImage(state, action) {
            state.imagePath = action.payload;
        },
        toggleCommentCollapse(state, action) {
            // redo
            // if(state.replyChains[action.payload].replies){
            //     state.replyChains[action.payload].replies = false;
            // }
            // else if(!state.replyChains[action.payload].replies){
            //     state.replyChains[action.payload].replies = true;
            // }
            // else {
            //     throw new Error('comment reducer machine broke');
            // }
            replySearcher(state.replyChains, action.payload);
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
                state.replyChains = [];
                state.content = action.payload[0].data.children[0].data;
                state.thread = action.payload[1].data.children;
                // data mappting for use in comment components
                // call expandReplies
                
                for(let comment of action.payload[1].data.children){
                    state.replyChains.push(extractReplies(comment, 0));
                }
                //conent type filtering for core link
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
export const selectReplyChains = state => state.thread.replyChains;
export const {updateThreadImage, toggleCommentCollapse} = threadSlice.actions;
export default threadSlice.reducer;