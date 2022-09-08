import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SearchBar } from "./searchbar/SearchBar";
import "./homepage.css";
import { selectSubreddits } from "../features/subreddits/subredditsSlice";
import { parseSelfText } from "../features/thread/threadSlice";
import parse from "html-react-parser";
import { useNavigate } from "react-router";

export const HomePage = () => {
    const subreddits = useSelector(selectSubreddits);
    const navigate = useNavigate();


    return (
        <section className="homepage-container">
            <h1>today's popular subreddits</h1>
            <SearchBar className="homepage-searchbar"/>
            <section className="homepage-subreddit-cards">
               {subreddits && subreddits.map(sub => {
                    const path = '/r/' + sub.data.display_name;
                    if(sub.data.display_name === 'Home') return <div className="homepage-ignore"></div>
                    return (
                        <div className="homepage-card"
                            onClick={e => {
                                e.preventDefault();
                                navigate(path);
                            }}>
                            <h3>{sub.data.display_name}</h3>
                            <p>{parse(parseSelfText(sub.data.public_description))}</p>
                            <img src={sub.data.icon_img}></img>
                        </div>
                    );
                })}
            </section>
        </section>
    )
}