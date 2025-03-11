import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home"; 
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css"; 
import Login from "./pages/Login"
import "./css/App.css"
import About from "./pages/About";

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};


export default App;