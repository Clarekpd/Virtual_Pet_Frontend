import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PetsList from "./PetsList";
import PetCare from "./petInteractionPage/PetCare";
import About from "./About";
import Login from "./Login";
import Signup from "./Signup";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PetsList />} />
        <Route path="/pet/:name" element={<PetCare />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}