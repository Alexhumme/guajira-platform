import React from 'react';
import { Link } from 'react-router-dom';
import './Communities.css';

const Communities = () => {
  // Datos de comunidades (luego vendrán del backend)
  const communities = [
    {
      id: 'nazareth',
      name: 'Nazareth',
      logo: '[ LOGO: Escudo Nazareth ]',
      municipality: 'Uribia',
      description: 'Comunidad Wayúu especializada en tejido tradicional y artesanías con más de 100 años de historia.',
      mainActivity: 'Artesanías y Tejidos',
      stats: {
        families: 45,
        artisans: 28,
        products: 120
      },
      coverImage: '[ IMAGEN: Vista de Nazareth ]'
    },
    {
      id: 'uribia',
      name: 'Uribia',
      logo: '[ LOGO: Escudo Uribia ]',
      municipality: 'Uribia',
      description: 'Capital indígena de Colombia, conocida por sus textiles tradicionales y gastronomía ancestral.',
      mainActivity: 'Textiles y Gastronomía',
      stats: {
        families: 60,
        artisans: 35,
        products: 150
      },
      coverImage: '[ IMAGEN: Vista de Uribia ]'
    },
    {
      id: 'manaure',
      name: 'Manaure',
      logo: '[ LOGO: Escudo Manaure ]',
      municipality: 'Manaure',
      description: 'Comunidad dedicada al turismo cultural y experiencias tradicionales Wayúu.',
      mainActivity: 'Turismo Cultural',
      stats: {
        families: 38,
        artisans: 22,
        products: 85
      },
      coverImage: '[ IMAGEN: Vista de Manaure ]'
    },
    {
      id: 'cabo-vela',
      name: 'Cabo de la Vela',
      logo: '[ LOGO: Escudo Cabo de la Vela ]',
      municipality: 'Uribia',
      description: 'Comunidad costera que ofrece experiencias gastronómicas y artesanías únicas del litoral guajiro.',
      mainActivity: 'Gastronomía y Artesanías',
      stats: {
        families: 30,
        artisans: 18,
        products: 65
      },
      coverImage: '[ IMAGEN: Vista de Cabo de la Vela ]'
    },
    {
      id: 'riohacha',
      name: 'Riohacha',
      logo: '[ LOGO: Escudo Riohacha ]',
      municipality: 'Riohacha',
      description: 'Centro cultural urbano que reúne artesanos de diversas rancherías, promoviendo la joyería tradicional.',
      mainActivity: 'Joyería Tradicional',
      stats: {
        families: 52,
        artisans: 40,
        products: 180
      },
      coverImage: '[ IMAGEN: Vista de Riohacha ]'
    },
    {
      id: 'maicao',
      name: 'Maicao',
      logo: '[ LOGO: Escudo Maicao ]',
      municipality: 'Maicao',
      description: 'Comunidad multicultural que combina tradiciones Wayúu con experiencias de intercambio cultural.',
      mainActivity: 'Experiencias Culturales',
      stats: {
        families: 42,
        artisans: 25,
        products: 95
      },
      coverImage: '[ IMAGEN: Vista de Maicao ]'
    }
  ];

  const totalFamilies = communities.reduce((sum, c) => sum + c.stats.families, 0);
  const totalArtisans = communities.reduce((sum, c) => sum + c.stats.artisans, 0);
  const totalProducts = communities.reduce((sum, c) => sum + c.stats.products, 0);

  return (
    <div className="communities-page">
      {/* Header */}
      <div className="communities-page-header">
        <div className="communities-page-header-content">
          <h1>Nuestras Comunidades</h1>
          <p>
            Conoce las {communities.length} comunidades de La Guajira que forman parte de nuestro proyecto, 
            preservando su cultura y compartiendo sus productos con el mundo.
          </p>
        </div>
      </div>

      <div className="communities-page-container">
        {/* Estadísticas globales */}
        <div className="global-stats">
          <div className="global-stat-card">
            <div className="global-stat-number">{communities.length}</div>
            <div className="global-stat-label">Comunidades</div>
          </div>
          <div className="global-stat-card">
            <div className="global-stat-number">{totalFamilies}</div>
            <div className="global-stat-label">Familias</div>
          </div>
          <div className="global-stat-card">
            <div className="global-stat-number">{totalArtisans}</div>
            <div className="global-stat-label">Artesanos</div>
          </div>
          <div className="global-stat-card">
            <div className="global-stat-number">{totalProducts}+</div>
            <div className="global-stat-label">Productos</div>
          </div>
        </div>

        {/* Grid de comunidades */}
        <div className="communities-grid">
          {communities.map((community) => (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="community-card"
            >
              {/* Imagen de portada */}
              <div className="community-card-cover">
                <p>{community.coverImage}</p>
              </div>

              {/* Logo sobre la imagen */}
              <div className="community-card-logo">
                <p>{community.logo}</p>
              </div>

              {/* Contenido */}
              <div className="community-card-content">
                <h2>{community.name}</h2>
                <p className="community-municipality">📍 {community.municipality}, La Guajira</p>
                <p className="community-description">{community.description}</p>
                
                <div className="community-activity-badge">
                  {community.mainActivity}
                </div>

                {/* Mini estadísticas */}
                <div className="community-mini-stats">
                  <div className="mini-stat">
                    <span className="mini-stat-number">{community.stats.families}</span>
                    <span className="mini-stat-label">Familias</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-stat-number">{community.stats.artisans}</span>
                    <span className="mini-stat-label">Artesanos</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-stat-number">{community.stats.products}+</span>
                    <span className="mini-stat-label">Productos</span>
                  </div>
                </div>

                <div className="community-card-footer">
                  <span className="view-community-link">
                    Ver comunidad →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communities;
