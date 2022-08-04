import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SearchBar } from "./searchbar/SearchBar";
import "./navbar.css"
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Menu from '@mui/icons-material/Menu';
import { Icon, IconButton } from "@mui/material";

export const NavBar = () => {
    const navigate = useNavigate();

    return (
        <div className='navbar-layout'>
          <NavLink to="/r/popular" className="nav-header"><h1 className="nav-header">RE:ddit</h1></NavLink>
          <SearchBar className="searchbar"/>
          <div className="nav-button-tray">
            <IconButton>
              <ArrowBack className="nav-button" size='medium' onClick={() => navigate(-1)}>Back</ArrowBack>
            </IconButton>
            <IconButton>
              <ArrowForward className="nav-button" size='medium' onClick={() => navigate(1)}>Forward</ArrowForward>
            </IconButton>
            <IconButton>
                <Menu className="navbar-smallformat" size="medium"/>
            </IconButton>
          </div>
        </div>
    )
}