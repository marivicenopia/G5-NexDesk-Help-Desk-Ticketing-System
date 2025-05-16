import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignIn from './components/SignIn';
import Settings from './components/Settings';
import SettingsSidebar from './components/SettingsSidebar';
import LeftSidebar from './components/LeftSidebar';

function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
  };

  const handleLogout = () => {
    setUserEmail(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
        {userEmail && <LeftSidebar />}
        {userEmail && <SettingsSidebar userEmail={userEmail} />}
        <div className="main-content">
          <Routes>
            {!userEmail && (
              <Route path="/" element={<SignIn onLoginSuccess={handleLoginSuccess} />} />
            )}
            {userEmail && (
              <>
                <Route
                  path="/"
                  element={<Settings userEmail={userEmail} />}
                />
                <Route
                  path="/logout"
                  element={
                    <button onClick={handleLogout}>Log out</button>
                  }
                />
              </>
            )}
            <Route
              path="*"
              element={<Navigate to={userEmail ? '/' : '/'} replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;