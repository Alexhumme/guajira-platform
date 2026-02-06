import React from 'react';
import Hero from '../components/Hero';
import Communities from '../components/Communities';
import Products from '../components/Products';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Communities />
      <Products />
      <Gallery />
      <Contact />
    </>
  );
};

export default Home;
