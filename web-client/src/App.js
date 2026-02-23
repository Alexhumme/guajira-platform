import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guajira-platform" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/community/:id" element={<CommunityDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
