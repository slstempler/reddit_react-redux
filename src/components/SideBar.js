import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getSubreddits, selectSubreddits } from "../features/subreddits/subredditsSlice";
import "./sidebar.css";

export const SideBar = () => {
    const dispatch = useDispatch();
    const subreddits = useSelector(selectSubreddits);
    const location = useLocation;

    const firstRender = () => {
        dispatch(getSubreddits());
    }

    useEffect(firstRender, [location])

    return (
        <div className="sidebar-container">
            <p>popular subreddits</p>
            <ul className="sidebar-list">
            {subreddits.map(sub => {
                const path = '/r/' + sub.data.display_name;
                return (
                    <li className="sidebar-item" key={sub.data.id}>
                        <Link className="sidebar-link" to={path} key={sub.data.id}>{sub.data.display_name}</Link>
                    </li>
                );
                }
            )}
            </ul>
        </div>
    )
}