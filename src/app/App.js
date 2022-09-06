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
import { HomePage } from '../components/HomePage';

export default function App() {
  const navigate = useNavigate();

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
  }

  return (
      <div className="wrapper">
        <div className="page-container">
          <NavBar />
          <div id="modal-fade" className='modal-fade-inactive'
          onClick={(e) => {
            document.getElementById("navbar-expandable").classList.toggle('hamburger-closed');
            document.getElementById('navbar-expandable').classList.toggle('hamburger-open');
            document.getElementById('modal-fade').classList.toggle('modal-fade-active');
            document.getElementById('modal-fade').classList.toggle('modal-fade-inactive');
            document.getElementById('navbar-subreddits').classList.remove('navbar-subreddits-open');
            document.getElementById('navbar-subreddits').classList.add('navbar-subreddits-closed');
          }}></div>
          <SideBar />
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/r/:subreddit" element={<Posts />} />
            <Route path="/r/:subreddit/comments/:threadId" element={<Thread />} />
          </Routes>
        </div>
        <KeyboardDoubleArrowUp className='scroll-button' onClick={scrollToTop}/>
      </div>
  );
}
