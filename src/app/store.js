import {configureStore} from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice'
import searchBarReducer from '../components/searchbar/searchBarSlice'

export default configureStore({
    reducer: {
        posts: postsReducer,
        searchBar: searchBarReducer,
    }
});

