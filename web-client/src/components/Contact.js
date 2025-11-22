import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se implementará la lógica de envío
    console.log('Formulario enviado:', formData);
    alert('Gracias por tu mensaje. Te contactaremos pronto.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="contact" id="contacto">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="section-title">Contáctanos</h2>
          <p className="section-subtitle">
            ¿Tienes preguntas o deseas colaborar? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="contact-content">
          {/* Información de contacto */}
          <div className="contact-info">
            <div className="info-card">
              <h3>Información</h3>
              <div className="info-item">
                <strong>Email:</strong>
                <p>info@guajiraplatform.com</p>
              </div>
              <div className="info-item">
                <strong>Teléfono:</strong>
                <p>+57 300 123 4567</p>
              </div>
              <div className="info-item">
                <strong>Ubicación:</strong>
                <p>Riohacha, La Guajira<br/>Colombia</p>
              </div>
            </div>

            <div className="info-card">
              <h3>Horario de Atención</h3>
              <div className="info-item">
                <strong>Lunes a Viernes:</strong>
                <p>8:00 AM - 6:00 PM</p>
              </div>
              <div className="info-item">
                <strong>Sábados:</strong>
                <p>9:00 AM - 2:00 PM</p>
              </div>
              <div className="info-item">
                <strong>Domingos:</strong>
                <p>Cerrado</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>

      {/* Patrón decorativo */}
      <div className="contact-pattern"></div>
    </section>
  );
};

export default Contact;
