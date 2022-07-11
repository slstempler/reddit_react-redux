import React from "react";
import { Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {setTerm, selectSearch} from "./searchBarSlice";

export const SearchBar = () => {
    const searchTerm = useSelector(selectSearch)
    let navigate = useNavigate();
    const dispatch = useDispatch();
    let checkSubmit = false;
    let newUrl;

    const handleSubmit = (e) => {
        e.preventDefault();
        newUrl = "/r/" + searchTerm;
        checkSubmit = true;
        console.log(`submit status: ${checkSubmit}, url: ${newUrl}`);
        navigate(newUrl);
    }
    const handleChange = (e) => {
        dispatch(setTerm(e.target.value));
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="search-field">Subreddit Search:</label>
            <input name="search-field"
                type="text"
                placeholder="search here"
                onChange={handleChange}>
            </input>
            <button type="button">Submit</button>
        </form>
    )
}