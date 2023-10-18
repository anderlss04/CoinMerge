import React from "react";
import Header from "./index/Header";
import MainContent from "./index/MainContent";
import Footer from "./index/Footer";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes , Route } from "react-router-dom";

function App() {
  const path = window.location.pathname;

  return (
    <Router>
      {!path.startsWith("/dashboard") && <Header />}
      <Routes >
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes >
      <Footer />
    </Router>
  );
}

export default App;
