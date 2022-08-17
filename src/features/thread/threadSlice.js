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
    let finalText = text + "\n "; //trailing spacing handles odd regex interactions
    const heading1Regex = /^#.*/gmi;
    const heading2Regex = /^##.*/gmi;
    const heading3Regex = /^###.*/gmi;
    const heading4Regex = /^####.*/gmi;
    const heading5Regex = /^#####.*/gmi;
    const heading6Regex = /^######.*/gmi;
    const italicRegex = /\*[^\*]+\*|\_[^\_]+\_/gm;
    const boldRegex = /\*\*[^\*]+\*\*|\_\_[^\_]+\_\_/gmi;
    const boldItalRegex = /\*\*\*[^\*]\*\*\*|\_\_\_[^\_]+\_\_\_/gmi;
    const strikethroughRegex = /\~\~[^\~]+\~\~/gmi;
    const bulletRegex = /^[\-\+\*]{1}\s.*?\n[\n|[[:blank:]]/sgmi;
    const subBulletRegex = /^[\-\+\*]{1}\s.*$/gmi;
    //not picking up ">" in regex - due to HTML parser?
    const blockquoteRegex = /(^&gt;.+?)(\r?\n?\n\w?\n?[\n\s])/mgsi;
    const horizLineRegex = /^[-*]+?\s/gmi;
    const newlineRegex = /\n/gmi;
    const mdURLRegex = /\[(.*?)\)[\s\W]/gmi;

    // Blockquotes: > in front of paragraph
    finalText = finalText.replace(blockquoteRegex, (match, p1, p2) => {
       console.log(`found blockquote: ${p1} | ${p2} | match: ${match}`);
        let noMarkdown = p1.slice(4);
        let noSpacing = p2.slice(2);
        return `<blockquote>${noMarkdown}</blockquote> ${noSpacing}`;
    });

    // Bullets: * or - (maybe want <ul>?)
    finalText = finalText.replace(bulletRegex, (match) => {
        console.log(`located bulleted list!`);
        let final = match.replace(subBulletRegex, subMatch => {
            return `<li>${subMatch}</li>`;
        });
        return `<ul>${final}</ul>`
    });

    // Bold + Italic: ***bold-ital*** or ___bold-ital___
    finalText = finalText.replace(boldItalRegex, match => {
        let noMarkdown = match.slice(3, match.length-3);
        return `<strong><em>${noMarkdown}</em></strong>`;
    });

    // Bold: **bold** or __bold__
    finalText = finalText.replace(boldRegex, match => {
        let noMarkdown = match.slice(2, match.length-2);
        return `<strong>${noMarkdown}</strong>`;
    });

    // Italic: *italic* or _italic_ 
    finalText = finalText.replace(italicRegex, match => {
        let noMarkdown = match.slice(1, match.length-1);
        return `<em>${noMarkdown}</em>`;
    });

    // Strikethrough: ~~strikethrough~~
    finalText = finalText.replace(strikethroughRegex, match => {
        let noMarkdown = match.slice(2, match.length-2);
        return `<s>${noMarkdown}</s>`;
    })
      
    // pulls formatted URL into anchor
    if(finalText.match(mdURLRegex)) {
        //console.log(`found reddit markdown: ${finalText}`)
        finalText = finalText.replace(mdURLRegex, (match) => {
            
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
            finalText = finalText.replace(urlRegex, match => {
                return `<a href=${match}>${match}</a>`;
            });
    }

    
    

    // Headings h1-h6
    finalText = finalText.replace(heading1Regex, (match) => {
        let noMarkdown = match.slice(2); //removes MD
        return `<h1>${noMarkdown}</h1>`;
    });
    finalText = finalText.replace(heading2Regex, (match) => {
        let noMarkdown = match.slice(2);
        return `<h2>${noMarkdown}</h3>`;
    });
    finalText = finalText.replace(heading3Regex, (match) => {
        let noMarkdown = match.slice(3); 
        return `<h3>${noMarkdown}</h3>`;
    });
    finalText = finalText.replace(heading4Regex, (match) => {
        let noMarkdown = match.slice(4);
        return `<h4>${noMarkdown}</h4>`;
    });
    finalText = finalText.replace(heading5Regex, (match) => {
        let noMarkdown = match.slice(5);
        return `<h5>${noMarkdown}</h5>`;
    });
    finalText = finalText.replace(heading6Regex, (match) => {
        let noMarkdown = match.slice(6);
        return `<h6>${noMarkdown}</h6>`;
    });

    finalText = finalText.replace(horizLineRegex, (match) => {
        console.log(`found match ${match}!`);
        return "<br><hr><br>";
    });

    // replace newline characters with HTML 
    finalText = finalText.replace(newlineRegex, "<br>");

    // Replace &#x200B; zero-width space
    finalText = finalText.replace("&amp;#x200B;", "&nbsp;");

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