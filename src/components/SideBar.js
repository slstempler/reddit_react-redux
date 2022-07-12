import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { getSubreddits, selectSubreddits } from "../features/subreddits/subredditsSlice";

export const SideBar = () => {
    const dispatch = useDispatch();
    const subreddits = useSelector(selectSubreddits);
    const location = useLocation;

    const firstRender = () => {
        dispatch(getSubreddits());
    }

    useEffect(firstRender, [location])

    return (
        <div className="sidebar-bar">
            <p>=========POPULAR SUBREDDITS=========</p>
            {subreddits.map(sub => {
                const path = '/r/' + sub.data.display_name;
                return (
                    <>
                        <Link className="sidebar-link" to={path} key={sub.data.id}>{sub.data.display_name}</Link>
                        <br/>
                    </>
                );
                }
            )}
        </div>
    )
}