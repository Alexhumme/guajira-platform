import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Columna 1: Sobre nosotros */}
        <div className="footer-column">
          <h3>Guajira Platform</h3>
          <p>
            Conectando comunidades tradicionales con el mundo. 
            Promovemos la cultura, el arte y el turismo de La Guajira.
          </p>
        </div>

        {/* Columna 2: Enlaces rápidos */}
        <div className="footer-column">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#comunidades">Comunidades</a></li>
            <li><a href="#productos">Productos</a></li>
            <li><a href="#galeria">Galería</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="footer-column">
          <h4>Contacto</h4>
          <ul className="footer-contact">
            <li>info@guajiraplatform.com</li>
            <li>+57 300 123 4567</li>
            <li>Riohacha, La Guajira, Colombia</li>
          </ul>
        </div>

        {/* Columna 4: Redes sociales */}
        <div className="footer-column">
          <h4>Síguenos</h4>
          <div className="footer-social">
            <a href="#facebook" aria-label="Facebook">Facebook</a>
            <a href="#instagram" aria-label="Instagram">Instagram</a>
            <a href="#twitter" aria-label="Twitter">Twitter</a>
            <a href="#whatsapp" aria-label="WhatsApp">WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2025 Guajira Platform. Todos los derechos reservados.</p>
        <p className="footer-tagline">Construyendo puentes entre tradiciones y modernidad</p>
      </div>
    </footer>
  );
};

export default Footer;
