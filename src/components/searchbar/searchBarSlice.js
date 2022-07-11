import { createSlice } from "@reduxjs/toolkit";

export const searchBarSlice = createSlice ({
    name: 'searchBar',
    initialState: '',
    reducers: {
        setTerm: (state, action) => state = action.payload,
    }
})

export const {setTerm} = searchBarSlice.actions;
export const selectSearch = state => state.searchBar;
export default searchBarSlice.reducer;