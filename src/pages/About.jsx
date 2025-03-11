import React from "react";
import Navbar from "../components/Navbar"; 
import "../css/About.css"; 

const About = () => {
  return (
    <div className="about-container">
      <Navbar userEmail="user@example.com" activeTab="about" setActiveTab={() => {}} />
      <div className="about-content">
        <h2>About BusyPad</h2>
        <p>BusyPad is an educational toy that helps users learn while having fun.</p>
        <p>It combines interactive technology with engaging content to create an immersive learning experience.</p>
      </div>
    </div>
  );
};

export default About;