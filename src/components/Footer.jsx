import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            <span className="logo-bracket">{"{"}</span>CP Scheduler<span className="logo-bracket">{"}"}</span>
          </div>
          <p>Your Competitive Programming Contest Scheduler</p>
          <div className="footer-links">
            <Link to="/">Contests</Link>
            <Link to="/hackathons">Hackathons</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
