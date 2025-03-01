import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home"; 
import GameCard from "./components/GameCard"; // for one game
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from "./pages/Login"
import "./App.css"

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<h2 className="text-center">Game List Page</h2>} />
        <Route path="/about" element={<h2 className="text-center">About Page</h2>} />
        <Route path="/contact" element={<h2 className="text-center">Contact Page</h2>} /> */}
      </Routes>
    </Router>
  );
};

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//       </Routes>
//     </Router>
//   );
// }

export default App;