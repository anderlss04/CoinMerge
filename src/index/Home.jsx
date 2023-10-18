import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import MainContent from "./MainContent";
import Footer from "./Footer";
import { BrowserRouter as Router } from 'react-router-dom';

function Index() {
  return (
    <Router>
      <Header />
      <Navigation />
      <MainContent />
      <Footer />
    </Router>
  );
}

export default Index;
