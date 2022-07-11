import logo from '../logo.svg';
import '../App.css';
import {BrowserRouter as Router, Route, Link, NavLink, useRouteMatch, Routes,} from 'react-router-dom';
import {Post} from '../features/posts/Post';
import {Posts} from '../features/posts/Posts';
import { SearchBar } from '../components/searchbar/SearchBar';

export default function App() {
  return (
      <Router>
        <h1>TESTING</h1>
        <NavLink to="/">Back home!</NavLink>
        <SearchBar />
        <Routes>
          <Route path="/" element={<p>Home :)</p>}/>
          <Route path="/r/:subreddit" element={<Posts />} />
        </Routes>
      </Router>
  );
}
