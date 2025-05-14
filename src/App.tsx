import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import CreateTicket from './CreateTicket';
import DeleteTicket from './DeleteTicket';
import EditTicket from './EditTicket';
import ViewTicket from './ViewTicket';
import AssignTicket from './AssignTicket'; // Import your new AssignTicket component
import ReassignTicket  from './ReAssignTicket';


// Simple Dashboard component as a placeholder
const Dashboard = () => {
  return (
    <div className="ticket-content">
      <h1 className="page-title">Dashboard</h1>
      <div className="ticket-box">
        <p>Welcome to the ticket management system dashboard.</p>
      </div>
    </div>
  );
};

// Ticket Summary component as a placeholder
const TicketSummary = () => {
  return (
    <div className="ticket-content">
      <h1 className="page-title">Ticket Summary Report</h1>
      <div className="ticket-box">
        <p>View all ticket statistics and reports here.</p>
      </div>
    </div>
  );
};

// Article component as a placeholder
const Article = () => {
  return (
    <div className="ticket-content">
      <h1 className="page-title">Articles</h1>
      <div className="ticket-box">
        <p>Knowledge base articles and documentation.</p>
      </div>
    </div>
  );
};

// Feedback component as a placeholder
const Feedback = () => {
  return (
    <div className="ticket-content">
      <h1 className="page-title">Feedback</h1>
      <div className="ticket-box">
        <p>Submit and view feedback about our services.</p>
      </div>
    </div>
  );
};

// Note: Removed the placeholder AssignTicket component since we're importing the real one



function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <div className="logo-square">N</div>
            <div className="logo-text">Newicon</div>
          </div>
          <nav className="nav-menu">
            <ul>
              <li>
                <Link to="/dashboard" className="menu-item">
                  <div className="menu-icon">📊</div>
                  <div>Dashboard</div>
                </Link>
              </li>
              <li className="dropdown-container">
                <div className="menu-item dropdown-trigger" onClick={toggleDropdown}>
                  <div className="menu-icon">🎫</div>
                  <div>Ticket Management</div>
                  <div className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</div>
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/create-ticket" className="dropdown-item">
                      <div className="dropdown-icon">➕</div>
                      <div>Create Ticket</div>
                    </Link>
                    <Link to="/edit-ticket" className="dropdown-item">
                      <div className="dropdown-icon">✏️</div>
                      <div>Edit Ticket</div>
                    </Link>
                    <Link to="/view-ticket" className="dropdown-item">
                      <div className="dropdown-icon">👁️</div> 
                      <div>View Ticket</div>
                    </Link>
                    <Link to="/assign-ticket" className="dropdown-item">
                      <div className="dropdown-icon">👤</div>
                      <div>Assign Ticket</div>
                    </Link>
                    <Link to="/reassign-ticket" className="dropdown-item">
                      <div className="dropdown-icon">🔄</div>
                      <div>Reassign Ticket</div>
                    </Link>
                    <Link to="/delete-ticket" className="dropdown-item">
                      <div className="dropdown-icon">🗑️</div>
                      <div>Delete Ticket</div>
                    </Link>
                  </div>
                )}
              </li>
              <li>
                <Link to="/ticket-summary" className="menu-item">
                  <div className="menu-icon">📑</div>
                  <div>Ticket Summary Report</div>
                </Link>
              </li>
              <li>
                <Link to="/article" className="menu-item">
                  <div className="menu-icon">📄</div>
                  <div>Article</div>
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="menu-item">
                  <div className="menu-icon">💬</div>
                  <div>Feedback</div>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="settings">
            <div className="settings-icon">⚙️</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <div className="top-header">
            <div className="search-container">
              <input type="text" placeholder="Search Ticket" className="search-input" />
              <button className="search-button">🔍</button>
            </div>
            <div className="user-area">
              <div className="notification-bell">🔔</div>
              <div className="user-avatar">👤 James Lebron</div>
            </div>
          </div>

          {/* Content will be rendered here based on routes */}
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/view-ticket" element={<ViewTicket />} />
            <Route path="/edit-ticket" element={<EditTicket />} />
            <Route path="/delete-ticket" element={<DeleteTicket />} />
            <Route path="/assign-ticket" element={<AssignTicket />} /> {/* Now using the imported component */}
            <Route path="/reassign-ticket" element={<ReassignTicket />} />
            <Route path="/ticket-summary" element={<TicketSummary />} />
            <Route path="/article" element={<Article />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;