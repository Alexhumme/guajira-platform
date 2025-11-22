import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Communities from './components/Communities';
import Products from './components/Products';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      <main className="main-content">
        <Hero />
        <Communities />
        <Products />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
