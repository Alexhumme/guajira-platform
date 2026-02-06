import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();

  // Simulación de datos (luego vendrán del backend)
  const productsData = {
    1: { 
      name: 'Mochila Wayúu Tradicional', 
      price: 120000, 
      category: 'Artesanías', 
      community: 'Nazareth',
      communityId: 'nazareth',
      communityLogo: '[ LOGO: Escudo Nazareth ]',
      seller: 'María Gómez',
      sellerPhone: '573001234567',
      description: 'Hermosa mochila Wayúu tejida a mano con técnicas ancestrales transmitidas de generación en generación. Cada diseño cuenta una historia única de nuestra cultura. Los colores vibrantes representan la alegría y el espíritu de nuestro pueblo. Ideal para uso diario o como pieza decorativa.',
      features: ['100% algodón', 'Hecha a mano', 'Diseño único', 'Tiempo de elaboración: 15 días'],
      images: [
        '[ IMAGEN 1: Mochila Wayúu vista frontal ]',
        '[ IMAGEN 2: Mochila Wayúu vista lateral ]',
        '[ IMAGEN 3: Detalle del tejido ]',
        '[ IMAGEN 4: Artesana tejiendo ]'
      ]
    }
    // Agregar más productos según sea necesario
  };

  const product = productsData[id] || productsData[1];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hola ${product.seller}, estoy interesado en el producto: ${product.name}`);
    window.open(`https://wa.me/${product.sellerPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/shop">Tienda</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-content">
          {/* Galería de imágenes */}
          <div className="product-gallery">
            <div className="main-image">
              <p>{product.images[0]}</p>
            </div>
            <div className="thumbnail-grid">
              {product.images.map((image, index) => (
                <div key={index} className="thumbnail">
                  <p>{image}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="product-info-detail">
            <span className="product-category-tag">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="product-price-large">{formatPrice(product.price)}</div>

            {/* Comunidad */}
            <div className="seller-community-section">
              <div className="community-badge">
                <div className="community-logo-detail">
                  <p>{product.communityLogo}</p>
                </div>
                <div>
                  <p className="community-label">Comunidad</p>
                  <Link to={`/community/${product.communityId}`} className="community-name-link">
                    {product.community}
                  </Link>
                </div>
              </div>

              {/* Vendedor */}
              <div className="seller-info">
                <p className="seller-label">Artesano/Vendedor</p>
                <p className="seller-name">{product.seller}</p>
              </div>
            </div>

            {/* Descripción */}
            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            {/* Características */}
            <div className="product-features">
              <h3>Características</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Botón WhatsApp */}
            <button className="whatsapp-btn" onClick={handleWhatsAppClick}>
              <span className="whatsapp-icon">📱</span>
              Contactar por WhatsApp
            </button>

            <p className="contact-note">
              Al hacer clic, serás redirigido a WhatsApp para contactar directamente al vendedor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
