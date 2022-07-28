import React from "react";
import { Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {setTerm, selectSearch} from "./searchBarSlice";
import SearchIcon from '@mui/icons-material/Search';
import "../navbar.css"
import { IconButton } from "@mui/material";

export const SearchBar = () => {
    const searchTerm = useSelector(selectSearch)
    let navigate = useNavigate();
    const dispatch = useDispatch();
    let checkSubmit = false;
    let newUrl;

    const handleSubmit = (e) => {
        e.preventDefault();
        if(searchTerm.match(/[A-Za-z0-9]/g)){
            newUrl = "/r/" + searchTerm;
            checkSubmit = true;
            console.log(`submit status: ${checkSubmit}, url: ${newUrl}`);
            navigate(newUrl);
        }
        else {
            alert("invalid search.");
        }
    }
    const handleChange = (e) => {
        dispatch(setTerm(e.target.value));
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="search-field">Subreddit Search:</label>
            <input name="search-field"
                className="search-field"
                type="text"
                placeholder="search here"
                pattern="^[A-Za-z0-9]+$"
                onChange={handleChange}>
            </input>
            <IconButton type="submit" className="form-submit nav-button" size="medium">
                <input hidden />
                <SearchIcon className="form-submit-icon" size="medium"/>
            </IconButton>


        </form>
    )
}