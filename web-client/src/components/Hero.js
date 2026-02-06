import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="inicio">
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Descubre La Guajira
          </h1>
          <p className="hero-subtitle">
            Conectando comunidades tradicionales con el mundo. 
            Explora artesanías auténticas, experiencias culturales únicas 
            y el espíritu ancestral del pueblo Wayúu.
          </p>
          <div className="hero-buttons">
            <Link to="/shop">
              <button className="btn-primary">Explorar Productos</button>
            </Link>
            <a href="#comunidades">
              <button className="btn-secondary">Conocer Comunidades</button>
            </a>
          </div>
        </div>

        {/* Placeholder para imagen de fondo */}
        <div className="hero-image-placeholder">
          <p>[ IMAGEN: Paisaje de La Guajira - Desierto con atardecer y comunidad Wayúu ]</p>
        </div>
      </div>

      {/* Decoración con patrones geométricos */}
      <div className="hero-pattern-left"></div>
      <div className="hero-pattern-right"></div>
    </section>
  );
};

export default Hero;
