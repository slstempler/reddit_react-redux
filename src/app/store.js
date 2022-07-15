import {configureStore} from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import searchBarReducer from '../components/searchbar/searchBarSlice';
import subredditsReducer from '../features/subreddits/subredditsSlice';
import threadReducer from '../features/thread/threadSlice';

export default configureStore({
    reducer: {
        posts: postsReducer,
        searchBar: searchBarReducer,
        subreddits: subredditsReducer,
        thread: threadReducer,
    }
});

