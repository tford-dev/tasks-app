
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useStateValue } from '../ContextApi/StateProvider';

const Sun = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zm0 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V18a.75.75 0 01.75-.75zm9-6a.75.75 0 01.75.75h0v.01a.75.75 0 01-.75.74h-1.5a.75.75 0 010-1.5H21zm-15 0a.75.75 0 01.75.75h0v.01a.75.75 0 01-.75.74H3a.75.75 0 010-1.5h1.5zm11.096 6.596a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06zM6.904 6.904a.75.75 0 011.06 0l1.06 1.06A.75.75 0 017.964 9.03L6.904 7.97a.75.75 0 010-1.06zM17.124 6.844a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM6.876 17.156a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06z" clipRule="evenodd"/>
  </svg>
);

const Moon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M21.752 15.002A9.718 9.718 0 0112.003 22C6.478 22 2 17.523 2 12a9.998 9.998 0 019.27-9.97.75.75 0 01.865.965 8.218 8.218 0 00.47 6.772 8.243 8.243 0 006.778 4.42.75.75 0 01.37 1.287z"/>
  </svg>
);

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <button onClick={toggle} aria-label="Toggle theme" className="btn btn-ghost" title="Toggle theme">
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export const Header = () => {
  const [initialState] = useStateValue();
  const authUser = JSON.parse(initialState.authenticatedUser || null);

  return (
    <header>
      <nav className="nav">
        {/* Left: Logo & Primary Nav (non-stacking, horizontally scrollable on small screens) */}
        <div className="nav-row">
          <h1 className="nav-logo"><Link to="/">Tasks App</Link></h1>
          <ul className="nav-list">
            <li><NavLink exact className="nav-link" activeClassName="nav-link-active" to="/">Tasks</NavLink></li>
            <li><NavLink className="nav-link" activeClassName="nav-link-active" to="/tasks/new">New Task</NavLink></li>
          </ul>
        </div>

        {/* Right: Theme toggle + Auth */}
        <div className="nav-row">
          <ThemeToggle />
          {authUser ? (
            <ul className="nav-list">
              <li className="nav-welcome hidden sm:block">Welcome, {authUser.firstName}</li>
              <li>
                <NavLink className="btn btn-secondary" activeClassName="nav-link-active" to="/signout">Sign Out</NavLink>
              </li>
            </ul>
          ) : (
            <ul className="nav-list">
              <li><NavLink className="btn btn-secondary" activeClassName="nav-link-active" to="/signin">Sign In</NavLink></li>
              <li><NavLink className="btn btn-primary" activeClassName="nav-link-active" to="/signup">Sign Up</NavLink></li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
