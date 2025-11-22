import React from 'react';
import './Communities.css';

const Communities = () => {
  return (
    <section className="communities" id="comunidades">
      <div className="communities-container">
        {/* Encabezado */}
        <div className="communities-header">
          <h2 className="section-title">Nuestras Comunidades</h2>
          <p className="section-subtitle">
            Actualmente conectamos a <strong>15 comunidades</strong> del departamento de La Guajira, 
            preservando su cultura y promoviendo el desarrollo sostenible.
          </p>
        </div>

        {/* Contenido principal: Mapa y Misión/Visión */}
        <div className="communities-content">
          {/* Columna del Mapa */}
          <div className="communities-map">
            <div className="map-placeholder">
              <p>[ MAPA INTERACTIVO: Mapa de La Guajira con 15 puntos marcados representando las comunidades conectadas ]</p>
            </div>
          </div>

          {/* Columna de Misión y Visión */}
          <div className="communities-mission">
            <div className="mission-card">
              <h3>Nuestra Misión</h3>
              <p>
                Conectar las comunidades tradicionales de La Guajira con el mundo, 
                facilitando el acceso al mercado para sus productos y servicios 
                mientras preservamos su identidad cultural y promovemos el desarrollo 
                económico sostenible.
              </p>
            </div>

            <div className="vision-card">
              <h3>Nuestra Visión</h3>
              <p>
                Ser el puente digital líder que empodera a las comunidades indígenas 
                y rurales de Colombia, reconocido por promover el comercio justo, 
                la preservación cultural y el turismo comunitario responsable.
              </p>
            </div>

            {/* Estadísticas */}
            <div className="communities-stats">
              <div className="stat-item">
                <span className="stat-number">15</span>
                <span className="stat-label">Comunidades</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">Artesanos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Productos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patrón decorativo de fondo */}
      <div className="communities-pattern"></div>
    </section>
  );
};

export default Communities;
