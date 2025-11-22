import React from 'react';
import './Gallery.css';

const Gallery = () => {
  const photos = [
    '[ IMAGEN: Mujer Wayúu tejiendo mochila ]',
    '[ IMAGEN: Paisaje del desierto de La Guajira ]',
    '[ IMAGEN: Niños de la comunidad ]',
    '[ IMAGEN: Artesanías coloridas ]',
    '[ IMAGEN: Ranchería tradicional ]',
    '[ IMAGEN: Atardecer en La Guajira ]',
    '[ IMAGEN: Ceremonia cultural ]',
    '[ IMAGEN: Productos artesanales ]'
  ];

  return (
    <section className="gallery" id="galeria">
      <div className="gallery-container">
        <div className="gallery-header">
          <h2 className="section-title">Nuestra Galería</h2>
          <p className="section-subtitle">
            Conoce de cerca la vida, cultura y belleza de las comunidades de La Guajira.
          </p>
        </div>

        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <div key={index} className="gallery-item">
              <div className="gallery-image">
                <p>{photo}</p>
              </div>
              <div className="gallery-overlay">
                <span>Ver más</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patrón decorativo */}
      <div className="gallery-pattern"></div>
    </section>
  );
};

export default Gallery;
