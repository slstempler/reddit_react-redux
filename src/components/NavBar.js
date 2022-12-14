import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SearchBar } from "./searchbar/SearchBar";
import { SideBar } from "./SideBar";
import "./navbar.css"
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Menu from '@mui/icons-material/Menu';
import { IconButton } from "@mui/material";

export const NavBar = () => {
    const navigate = useNavigate();

    return (
        <div className='navbar-layout'>
          <IconButton className="nav-button-wrapper navbar-smallformat" aria-label="Expand Menu" 
              onClick={(e) => {
                document.getElementById("navbar-expandable").classList.toggle('hamburger-closed');
                document.getElementById('navbar-expandable').classList.toggle('hamburger-open');
                document.getElementById('modal-fade').classList.toggle('modal-fade-active');
                document.getElementById('modal-fade').classList.toggle('modal-fade-inactive');
              }}
            >
              <Menu className="navbar-smallformat" size="medium"/>
          </IconButton>
          <NavLink to="/" className="nav-header"><h1 className="nav-header">RE:ddit</h1></NavLink>
          <SearchBar className="searchbar navbar-standardformat"/>
          <div className="nav-button-tray navbar-standardformat">
            <IconButton className="nav-button-wrapper navbar-standardformat" onClick={() => navigate(-1)} aria-label="Back">
              <ArrowBack className="nav-button" size='medium'>Back</ArrowBack>
            </IconButton>
            <IconButton className="nav-button-wrapper navbar-standardformat" onClick={() => navigate(1)} aria-label="Forward">
              <ArrowForward className="nav-button" size='medium'>Forward</ArrowForward>
            </IconButton>
          </div>
          <div id="navbar-expandable" className="navbar-expandable navbar-smallformat hamburger-closed">
              <SearchBar className="searchbar navbar-smallformat"/>
              <ul className="navbar-dropdown-menu">
                <li>
                  <IconButton className="nav-button-wrapper navbar-smallformat" onClick={() => navigate(-1)} aria-label="Back">
                    <ArrowBack className="nav-button" size='medium'>Back</ArrowBack>
                  </IconButton>
                </li>
                <li>
                  <IconButton className="nav-button-wrapper navbar-smallformat" onClick={() => navigate(1)} aria-label="Forward">
                    <ArrowForward className="nav-button" size='medium'>Forward</ArrowForward>
                  </IconButton>
                </li>
              </ul>
              <div className="navbar-sidebar">
                <button tabIndex={0}
                className="navbar-sidebar-header"
                aria-label="Expand Popular Subreddits"
                onClick={(e) => {
                  document.getElementById('navbar-subreddits').classList.toggle('navbar-subreddits-open');
                  document.getElementById('navbar-subreddits').classList.toggle('navbar-subreddits-closed');
                }}>Popular Subreddits <span className="material-symbols-outlined">
                expand_more</span></button>
                <SideBar className="navbar-smallformat navbar-subreddits-closed" idName="navbar-subreddits"/>
              </div>
          </div>
        </div>
    )
}