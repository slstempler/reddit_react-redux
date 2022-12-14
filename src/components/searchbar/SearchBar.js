import React from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {setTerm, selectSearch} from "./searchBarSlice";
import SearchIcon from '@mui/icons-material/Search';
import "../navbar.css"
import { IconButton } from "@mui/material";

export const SearchBar = ({className = ''}) => {
    const searchTerm = useSelector(selectSearch)
    let navigate = useNavigate();
    const dispatch = useDispatch();
    let newUrl;

    const handleSubmit = (e) => {
        e.preventDefault();
        if(searchTerm.match(/[A-Za-z0-9]/g)){
            newUrl = "/r/" + searchTerm;
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
        <form onSubmit={handleSubmit} className={className}>
            <label htmlFor="search-field">Subreddit Search:</label>
            <input name="search-field"
                className={"search-field " + className}
                type="text"
                placeholder="search here"
                pattern="^[A-Za-z0-9]+$"
                onChange={handleChange}>
            </input>
            <IconButton type="submit" className={"form-submit nav-button " + className} aria-label="Submit Search" size="medium">
                <input hidden />
                <SearchIcon className="form-submit-icon" size="medium"/>
            </IconButton>
        </form>
    )
}