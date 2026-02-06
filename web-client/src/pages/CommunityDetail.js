import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './CommunityDetail.css';

const CommunityDetail = () => {
  const { id } = useParams();

  // Datos de ejemplo de comunidades (luego vendrán del backend)
  const communitiesData = {
    'nazareth': {
      name: 'Nazareth',
      logo: '[ LOGO: Escudo de Nazareth ]',
      description: 'Nazareth es una comunidad Wayúu ubicada en el extremo norte de La Guajira, conocida por su rica tradición artesanal y su compromiso con la preservación de la cultura ancestral. Nuestra comunidad se dedica principalmente al tejido de mochilas y mantas con diseños tradicionales que han sido transmitidos de generación en generación.',
      mainActivities: [
        'Tejido de mochilas Wayúu',
        'Elaboración de mantas artesanales',
        'Joyería tradicional',
        'Turismo cultural'
      ],
      location: {
        department: 'La Guajira',
        municipality: 'Uribia',
        coordinates: 'Extremo norte del departamento'
      },
      leaders: [
        {
          name: 'María Gómez',
          role: 'Líder Artesanal',
          phone: '573001234567',
          photo: '[ FOTO: María Gómez ]'
        },
        {
          name: 'José Uriana',
          role: 'Autoridad Tradicional',
          phone: '573001234568',
          photo: '[ FOTO: José Uriana ]'
        }
      ],
      images: [
        '[ IMAGEN: Vista panorámica de Nazareth ]',
        '[ IMAGEN: Artesanas tejiendo ]',
        '[ IMAGEN: Ranchería tradicional ]',
        '[ IMAGEN: Productos artesanales ]',
        '[ IMAGEN: Ceremonia cultural ]',
        '[ IMAGEN: Niños de la comunidad ]'
      ],
      products: [
        { id: 1, name: 'Mochila Wayúu Tradicional', price: 120000, image: '[ IMAGEN: Mochila ]' },
        { id: 5, name: 'Collar Artesanal', price: 45000, image: '[ IMAGEN: Collar ]' },
        { id: 9, name: 'Aretes Tradicionales', price: 35000, image: '[ IMAGEN: Aretes ]' }
      ],
      stats: {
        families: 45,
        artisans: 28,
        products: 120
      }
    },
    'uribia': {
      name: 'Uribia',
      logo: '[ LOGO: Escudo de Uribia ]',
      description: 'Uribia, conocida como la capital indígena de Colombia, es el hogar de una vibrante comunidad Wayúu dedicada a las artes textiles y la gastronomía tradicional.',
      mainActivities: ['Textiles', 'Gastronomía', 'Agricultura tradicional', 'Artesanías'],
      location: { department: 'La Guajira', municipality: 'Uribia', coordinates: 'Centro del departamento' },
      leaders: [
        { name: 'Ana Pushaina', role: 'Líder Comunitaria', phone: '573001234569', photo: '[ FOTO: Ana Pushaina ]' }
      ],
      images: ['[ IMAGEN: Uribia 1 ]', '[ IMAGEN: Uribia 2 ]', '[ IMAGEN: Uribia 3 ]', '[ IMAGEN: Uribia 4 ]'],
      products: [
        { id: 2, name: 'Manta Tejida a Mano', price: 250000, image: '[ IMAGEN: Manta ]' },
        { id: 6, name: 'Tapiz Decorativo', price: 350000, image: '[ IMAGEN: Tapiz ]' },
        { id: 10, name: 'Miel de Abeja', price: 25000, image: '[ IMAGEN: Miel ]' }
      ],
      stats: { families: 60, artisans: 35, products: 150 }
    }
    // Más comunidades...
  };

  const community = communitiesData[id] || communitiesData['nazareth'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleWhatsAppClick = (phone, name) => {
    const message = encodeURIComponent(`Hola ${name}, me gustaría conocer más sobre la comunidad ${community.name}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="community-detail">
      {/* Header con logo y nombre */}
      <div className="community-header">
        <div className="community-header-content">
          <div className="community-logo-large">
            <p>{community.logo}</p>
          </div>
          <div className="community-title-section">
            <h1>Comunidad {community.name}</h1>
            <p className="community-location">
              📍 {community.location.municipality}, {community.location.department}
            </p>
          </div>
        </div>
      </div>

      <div className="community-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/shop">Tienda</Link>
          <span>/</span>
          <span>Comunidad {community.name}</span>
        </div>

        {/* Estadísticas */}
        <div className="community-stats-grid">
          <div className="stat-card">
            <div className="stat-number">{community.stats.families}</div>
            <div className="stat-label">Familias</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{community.stats.artisans}</div>
            <div className="stat-label">Artesanos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{community.stats.products}+</div>
            <div className="stat-label">Productos</div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="community-main-content">
          {/* Descripción */}
          <section className="community-section">
            <h2>Sobre Nuestra Comunidad</h2>
            <p className="community-description">{community.description}</p>
          </section>

          {/* Galería de imágenes */}
          <section className="community-section">
            <h2>Galería</h2>
            <div className="community-gallery-grid">
              {community.images.map((image, index) => (
                <div key={index} className="community-gallery-item">
                  <p>{image}</p>
                </div>
              ))}
            </div>
          </section>

          {/* A qué se dedican */}
          <section className="community-section">
            <h2>Nuestras Actividades</h2>
            <div className="activities-grid">
              {community.mainActivities.map((activity, index) => (
                <div key={index} className="activity-card">
                  <span className="activity-icon">✓</span>
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Ubicación */}
          <section className="community-section">
            <h2>Ubicación</h2>
            <div className="location-card">
              <div className="location-map-placeholder">
                <p>[ MAPA: Ubicación de {community.name} en La Guajira ]</p>
              </div>
              <div className="location-details">
                <div className="location-item">
                  <strong>Departamento:</strong>
                  <span>{community.location.department}</span>
                </div>
                <div className="location-item">
                  <strong>Municipio:</strong>
                  <span>{community.location.municipality}</span>
                </div>
                <div className="location-item">
                  <strong>Coordenadas:</strong>
                  <span>{community.location.coordinates}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Líderes */}
          <section className="community-section">
            <h2>Líderes y Contactos</h2>
            <div className="leaders-grid">
              {community.leaders.map((leader, index) => (
                <div key={index} className="leader-card">
                  <div className="leader-photo">
                    <p>{leader.photo}</p>
                  </div>
                  <div className="leader-info">
                    <h3>{leader.name}</h3>
                    <p className="leader-role">{leader.role}</p>
                    <button
                      className="leader-whatsapp-btn"
                      onClick={() => handleWhatsAppClick(leader.phone, leader.name)}
                    >
                      💬 Contactar por WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Productos de la comunidad */}
          <section className="community-section">
            <h2>Productos de {community.name}</h2>
            <div className="community-products-grid">
              {community.products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="community-product-card"
                >
                  <div className="community-product-image">
                    <p>{product.image}</p>
                  </div>
                  <div className="community-product-info">
                    <h4>{product.name}</h4>
                    <p className="community-product-price">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="view-all-products">
              <Link to="/shop" className="view-all-btn">
                Ver todos los productos
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
