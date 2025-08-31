import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import CreateTicket from './views/containers/CreateTicket';
import AssignTicket from './views/containers/AssignTicket';
import EditTicket from './views/containers/EditTicket';
import ReassignTicket from './views/containers/ReAssignTicket';
import ViewTicket from './views/containers/ViewTickets';

// Placeholder components - You'll replace these with real components later
const DeleteTicket = () => <div>Delete Ticket Component</div>;

// Simple Dashboard component as a placeholder
const Dashboard = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-5">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Welcome to the ticket management system dashboard.</p>
      </div>
    </div>
  );
};

// Ticket Summary component as a placeholder
const TicketSummary = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-5">Ticket Summary Report</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>View all ticket statistics and reports here.</p>
      </div>
    </div>
  );
};

// Article component as a placeholder
const Article = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-5">Articles</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Knowledge base articles and documentation.</p>
      </div>
    </div>
  );
};

// Feedback component as a placeholder
const Feedback = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-5">Feedback</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Submit and view feedback about our services.</p>
      </div>
    </div>
  );
};

function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 h-full bg-blue-950 text-white flex flex-col flex-shrink-0 overflow-visible">
          <div className="flex items-center p-5 border-b border-white/10">
            <div className="w-10 h-10 bg-blue-600 flex items-center justify-center font-bold text-xl rounded-lg mr-2">N</div>
            <div className="text-lg font-bold">Newicon</div>
          </div>
          <nav className="flex-1">
            <ul className="list-none p-0">
              <li>
                <Link to="/dashboard" className="flex items-center p-4 text-white no-underline hover:bg-blue-900">
                  <div className="mr-2 w-5 text-center">📊</div>
                  <div>Dashboard</div>
                </Link>
              </li>
              <li className="relative overflow-visible">
                <div 
                  className="flex items-center p-4 text-white cursor-pointer justify-between hover:bg-blue-900"
                  onClick={toggleDropdown}
                >
                  <div className="flex items-center">
                    <div className="mr-2 w-5 text-center">🎫</div>
                    <div>Ticket Management</div>
                  </div>
                  <div className="ml-2 text-xs">{dropdownOpen ? '▲' : '▼'}</div>
                </div>
                {dropdownOpen && (
                  <div className="fixed left-64 bg-blue-600 rounded shadow-lg w-48 z-10">
                    <Link to="/create-ticket" className="flex items-center p-3 text-white no-underline hover:bg-blue-500">
                      <div className="mr-2 w-5 text-center">➕</div>
                      <div>Create Ticket</div>
                    </Link>
                    <Link to="/edit-ticket" className="flex items-center p-3 text-white no-underline hover:bg-blue-500">
                      <div className="mr-2 w-5 text-center">✏️</div>
                      <div>Edit Ticket</div>
                    </Link>
                    <Link to="/view-ticket" className="flex items-center p-3 text-white no-underline hover:bg-blue-500">
                      <div className="mr-2 w-5 text-center">👁️</div> 
                      <div>View Ticket</div>
                    </Link>
                    <Link to="/assign-ticket" className="flex items-center p-3 text-white no-underline hover:bg-blue-500">
                      <div className="mr-2 w-5 text-center">👤</div>
                      <div>Assign Ticket</div>
                    </Link>
                    <Link to="/reassign-ticket" className="flex items-center p-3 text-white no-underline hover:bg-blue-500">
                      <div className="mr-2 w-5 text-center">🔄</div>
                      <div>Reassign Ticket</div>
                    </Link>
                    <Link to="/delete-ticket" className="flex items-center p-3 text-white no-underline hover:bg-blue-500">
                      <div className="mr-2 w-5 text-center">🗑️</div>
                      <div>Delete Ticket</div>
                    </Link>
                  </div>
                )}
              </li>
              <li>
                <Link to="/ticket-summary" className="flex items-center p-4 text-white no-underline hover:bg-blue-900">
                  <div className="mr-2 w-5 text-center">📑</div>
                  <div>Ticket Summary Report</div>
                </Link>
              </li>
              <li>
                <Link to="/article" className="flex items-center p-4 text-white no-underline hover:bg-blue-900">
                  <div className="mr-2 w-5 text-center">📄</div>
                  <div>Article</div>
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="flex items-center p-4 text-white no-underline hover:bg-blue-900">
                  <div className="mr-2 w-5 text-center">💬</div>
                  <div>Feedback</div>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-5 border-t border-white/10 flex justify-center">
            <div className="text-xl cursor-pointer">⚙️</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-100">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-white shadow-sm z-10">
            <div className="flex items-center bg-gray-100 rounded-full p-2 w-72">
              <input type="text" placeholder="Search Ticket" className="border-none bg-transparent flex-1 outline-none text-sm text-gray-800" />
              <button className="bg-transparent border-none cursor-pointer text-base">🔍</button>
            </div>
            <div className="flex items-center">
              <div className="mr-5 text-lg cursor-pointer">🔔</div>
              <div className="flex items-center cursor-pointer">James Lebron</div>
            </div>
          </div>

          {/* Content will be rendered here based on routes */}
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/view-ticket" element={<ViewTicket />} />
            <Route path="/edit-ticket" element={<EditTicket />} />
            <Route path="/delete-ticket" element={<DeleteTicket />} />
            <Route path="/assign-ticket" element={<AssignTicket />} />
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