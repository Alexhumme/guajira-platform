import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/communities">Comunidades</Link></li>
          <li><Link to="/shop">Tienda</Link></li>
          <li><a href="#galeria">Galería</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>

        {/* CTA Button */}
        <div className="navbar-cta">
          <Link to="/shop">
            <button className="cta-button">Explorar Tienda</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
