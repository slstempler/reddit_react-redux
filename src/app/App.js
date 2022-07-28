import logo from '../logo.svg';
import '../App.css';
import {BrowserRouter as Router, 
    Route, 
    Link, NavLink, 
    useRouteMatch, 
    Routes, 
    useNavigate,} from 'react-router-dom';
import {Post} from '../features/posts/Post';
import {Posts} from '../features/posts/Posts';
import { SearchBar } from '../components/searchbar/SearchBar';
import { SideBar } from '../components/SideBar';
import { Thread } from '../features/thread/Thread';
import { NavBar } from '../components/NavBar';
import KeyboardDoubleArrowUp from '@mui/icons-material/KeyboardDoubleArrowUp'

export default function App() {
  const navigate = useNavigate();

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
  }

  return (
      <div className="wrapper">
        <NavBar />
        <div className="page-container">
          <SideBar />
          <Routes>
            <Route path="/" element={<p>Home :)</p>}/>
            <Route path="/r/:subreddit" element={<Posts />} />
            <Route path="/r/:subreddit/comments/:threadId" element={<Thread />} />
          </Routes>
          <KeyboardDoubleArrowUp className='scroll-button' onClick={scrollToTop}/>
        </div>
      </div>
  );
}
