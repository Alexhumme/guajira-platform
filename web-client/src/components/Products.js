import React from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const categories = [
    {
      title: 'Artesanías',
      description: 'Mochilas, mantas y accesorios tejidos a mano con técnicas ancestrales Wayúu.',
      image: '[ IMAGEN: Mochilas Wayúu coloridas ]'
    },
    {
      title: 'Turismo Cultural',
      description: 'Experiencias auténticas con comunidades locales, tours guiados y alojamiento tradicional.',
      image: '[ IMAGEN: Ranchería Wayúu ]'
    },
    {
      title: 'Gastronomía',
      description: 'Productos alimenticios tradicionales: miel, quesos, chivos y platos típicos.',
      image: '[ IMAGEN: Platos típicos Wayúu ]'
    },
    {
      title: 'Joyería',
      description: 'Collares, aretes y pulseras elaborados con materiales naturales y diseños tradicionales.',
      image: '[ IMAGEN: Joyería artesanal ]'
    },
    {
      title: 'Textiles',
      description: 'Telas, tapices y productos textiles con patrones geométricos tradicionales.',
      image: '[ IMAGEN: Textiles con patrones ]'
    },
    {
      title: 'Experiencias',
      description: 'Talleres de tejido, ceremonias culturales y actividades de intercambio cultural.',
      image: '[ IMAGEN: Taller de tejido ]'
    }
  ];

  return (
    <section className="products" id="productos">
      <div className="products-container">
        <div className="products-header">
          <h2 className="section-title">Productos y Servicios</h2>
          <p className="section-subtitle">
            Descubre la riqueza cultural de La Guajira a través de nuestros productos 
            auténticos y experiencias únicas.
          </p>
        </div>

        <div className="products-grid">
          {categories.map((category, index) => (
            <div key={index} className="product-card">
              <div className="product-image">
                <p>{category.image}</p>
              </div>
              <div className="product-content">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <Link to="/shop">
                  <button className="product-btn">Ver más</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patrón decorativo */}
      <div className="products-pattern"></div>
    </section>
  );
};

export default Products;
