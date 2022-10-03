import React from "react";
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
                    if(sub.data.display_name === 'Home') return <div className="homepage-ignore" key={sub.data.display_name}></div>
                    return (
                        <div className="homepage-card"
                            key={sub.data.display_name}
                            onClick={e => {
                                e.preventDefault();
                                navigate(path);
                            }}>
                            <h2>{sub.data.display_name}</h2>
                            <div className="sub-description">{parse(parseSelfText(sub.data.public_description))}</div>
                            {(sub.data.icon_img || sub.data.community_icon) && 
                            <img alt={"subreddit icon for " + sub.data.display_name} loading="lazy" src={sub.data.icon_img ? sub.data.icon_img : sub.data.community_icon.replace(/&amp;/g, "&")}></img>}
                        </div>
                    );
                })}
            </section>
        </section>
    )
}