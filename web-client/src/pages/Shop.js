import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
  // Datos de productos de ejemplo
  const allProducts = [
    { id: 1, name: 'Mochila Wayúu Tradicional', price: 120000, category: 'Artesanías', community: 'Nazareth', communityId: 'nazareth', communityLogo: '[ LOGO: Escudo Nazareth ]', image: '[ IMAGEN: Mochila Wayúu colorida ]', seller: 'María Gómez' },
    { id: 2, name: 'Manta Tejida a Mano', price: 250000, category: 'Artesanías', community: 'Uribia', communityId: 'uribia', communityLogo: '[ LOGO: Escudo Uribia ]', image: '[ IMAGEN: Manta con patrones ]', seller: 'Ana Pushaina' },
    { id: 3, name: 'Tour Cultural Wayúu', price: 180000, category: 'Turismo Cultural', community: 'Manaure', communityId: 'manaure', communityLogo: '[ LOGO: Escudo Manaure ]', image: '[ IMAGEN: Ranchería Wayúu ]', seller: 'Carlos Ipuana' },
    { id: 4, name: 'Experiencia Gastronómica', price: 90000, category: 'Gastronomía', community: 'Cabo de la Vela', communityId: 'cabo-vela', communityLogo: '[ LOGO: Escudo Cabo de la Vela ]', image: '[ IMAGEN: Plato típico ]', seller: 'Rosa Epieyú' },
    { id: 5, name: 'Collar Artesanal', price: 45000, category: 'Joyería', community: 'Nazareth', communityId: 'nazareth', communityLogo: '[ LOGO: Escudo Nazareth ]', image: '[ IMAGEN: Collar artesanal ]', seller: 'María Gómez' },
    { id: 6, name: 'Tapiz Decorativo', price: 350000, category: 'Textiles', community: 'Uribia', communityId: 'uribia', communityLogo: '[ LOGO: Escudo Uribia ]', image: '[ IMAGEN: Tapiz con patrones ]', seller: 'Ana Pushaina' },
    { id: 7, name: 'Taller de Tejido', price: 120000, category: 'Experiencias', community: 'Manaure', communityId: 'manaure', communityLogo: '[ LOGO: Escudo Manaure ]', image: '[ IMAGEN: Taller de tejido ]', seller: 'Carlos Ipuana' },
    { id: 8, name: 'Mochila Pequeña', price: 75000, category: 'Artesanías', community: 'Cabo de la Vela', communityId: 'cabo-vela', communityLogo: '[ LOGO: Escudo Cabo de la Vela ]', image: '[ IMAGEN: Mochila pequeña ]', seller: 'Rosa Epieyú' },
    { id: 9, name: 'Aretes Tradicionales', price: 35000, category: 'Joyería', community: 'Nazareth', communityId: 'nazareth', communityLogo: '[ LOGO: Escudo Nazareth ]', image: '[ IMAGEN: Aretes ]', seller: 'María Gómez' },
    { id: 10, name: 'Miel de Abeja', price: 25000, category: 'Gastronomía', community: 'Uribia', communityId: 'uribia', communityLogo: '[ LOGO: Escudo Uribia ]', image: '[ IMAGEN: Frasco de miel ]', seller: 'Ana Pushaina' },
    { id: 11, name: 'Tour al Desierto', price: 200000, category: 'Turismo Cultural', community: 'Manaure', communityId: 'manaure', communityLogo: '[ LOGO: Escudo Manaure ]', image: '[ IMAGEN: Desierto de La Guajira ]', seller: 'Carlos Ipuana' },
    { id: 12, name: 'Ceremonia Ancestral', price: 150000, category: 'Experiencias', community: 'Cabo de la Vela', communityId: 'cabo-vela', communityLogo: '[ LOGO: Escudo Cabo de la Vela ]', image: '[ IMAGEN: Ceremonia cultural ]', seller: 'Rosa Epieyú' }
  ];

  const categories = ['Todos', 'Artesanías', 'Turismo Cultural', 'Gastronomía', 'Joyería', 'Textiles', 'Experiencias'];

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar productos
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.community.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="shop">
      {/* Header */}
      <div className="shop-header">
        <div className="shop-header-content">
          <h1>Nuestra Tienda</h1>
          <p>Descubre productos auténticos elaborados por comunidades de La Guajira</p>
        </div>
      </div>

      <div className="shop-container">
        {/* Sidebar de filtros */}
        <aside className="shop-sidebar">
          <div className="filter-section">
            <h3>Buscar</h3>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <h3>Categorías</h3>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Información</h3>
            <p className="filter-info">
              Todos nuestros productos apoyan directamente a las comunidades locales de La Guajira.
            </p>
          </div>
        </aside>

        {/* Grid de productos */}
        <main className="shop-main">
          <div className="shop-toolbar">
            <p className="results-count">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card-shop">
                <Link to={`/product/${product.id}`} className="product-link">
                  <div className="product-image-shop">
                    <p>{product.image}</p>
                    <span className="product-category-badge">{product.category}</span>
                  </div>
                </Link>
                <div className="product-info-shop">
                  <Link to={`/product/${product.id}`} className="product-link">
                    <h3>{product.name}</h3>
                  </Link>
                  <div className="community-info">
                    <div className="community-logo-small">
                      <p>{product.communityLogo}</p>
                    </div>
                    <Link to={`/community/${product.communityId}`} className="product-community-link">
                      {product.community}
                    </Link>
                  </div>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    <Link to={`/product/${product.id}`}>
                      <button className="view-more-btn">Ver más</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <p>No se encontraron productos con los filtros seleccionados.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
