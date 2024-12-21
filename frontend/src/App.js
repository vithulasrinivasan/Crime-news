import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SubmitNews from './components/SubmitNews';
import FilterNews from './components/FilterNews';
import EntryDetails from './components/EntryDetails';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>Crime News History Documentation</h1>
          <nav>
            <Link to="/submit-news" className="nav-button">Submit News</Link>
            <Link to="/filter-news" className="nav-button">Filter News</Link>
            
          </nav>
        </header>
        
        <Routes>
          <Route path="/submit-news" element={<SubmitNews />} />
          <Route path="/filter-news" element={<FilterNews />} />
          <Route path="/entry/:id" element={<EntryDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubmitNews from './components/SubmitNews';
import EntryDetails from './components/EntryDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubmitNews />} />
        <Route path="/entry/:id" element={<EntryDetails />} />
      </Routes>
    </Router>
  );
};

export default App;*/

