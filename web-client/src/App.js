import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      <main className="main-content">
        {/* Aquí irán las secciones: Hero, Mapa, Productos, Galería, Contacto */}
        <section id="inicio" style={{ minHeight: '100vh', paddingTop: '80px' }}>
          <h1 style={{ textAlign: 'center', paddingTop: '100px', color: '#E34234' }}>
            Sección Hero - En construcción
          </h1>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
