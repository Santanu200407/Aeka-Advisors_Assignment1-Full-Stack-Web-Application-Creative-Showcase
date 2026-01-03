import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import PublicProfile from './components/PublicProfile/PublicProfile';
import UserProfile from './components/UserProfile/UserProfile';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import LandingPage from './components/LandingPage/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/profile" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/profile" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile/:username" element={<PublicProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App