import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="logo-text">Guajira</span>
          <span className="logo-platform">Platform</span>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#comunidades">Comunidades</a></li>
          <li><a href="#productos">Productos</a></li>
          <li><a href="#galeria">Galería</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>

        {/* CTA Button */}
        <div className="navbar-cta">
          <button className="cta-button">Explorar</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
