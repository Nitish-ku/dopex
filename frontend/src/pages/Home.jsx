import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Navbar/>
      <Hero />
      <AiTools />
      <Testimonials />
      <Footer />
    </>
  )
}

export default Home
