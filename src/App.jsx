import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home"; 
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css"; 
import Login from "./pages/Login"
import "./css/App.css"
import About from "./pages/About";
import UserManagement from "./pages/UserManagement";

function App () {
  const [userId, setUserId] = useState("test"); // Set a valid userId
  const [user, setUser] = useState(null); // Store user data

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/home" element={<Home userId={userId} user={user} setUser={setUser} />} />
        <Route path="/user-management" element={<UserManagement user={user} setUser={setUser} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};


export default App;