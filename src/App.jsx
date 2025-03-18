import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home"; 
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css"; 
import Login from "./pages/Login"
import "./css/App.css"
import About from "./pages/About";
import UserManagement from "./pages/UserManagement";
import PlayerHome from "./pages/PlayerHome";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Protect routes that require authentication
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  // Clear user data if it's invalid
  useEffect(() => {
    if (user && !user.email) {
      localStorage.removeItem('userData');
      setUser(null);
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player-home"
          element={
            <ProtectedRoute>
              <PlayerHome user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagement user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;