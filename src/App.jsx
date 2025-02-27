import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home/Home.jsx';
import About from './pages/about/About.jsx';
import Products from './pages/products/Products.jsx';
import Contact from "./pages/contact/Contact.jsx";
import CheckoutPage from './pages/checkout/CheckoutPage.jsx';
import AutoScrollTop from './components/AutoScrollTop.jsx';

import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer"


function App() {

  return (
      <Router>
        <AutoScrollTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <Footer />
      </Router>
  )
}

export default App
