import React from 'react'
import HeroSection from '../components/HeroSection'
import Feature from '../components/Feature'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <Feature/>
      <Banner/>
      <Testimonial/>
      <Newsletter/>
      <Footer/>
    </div>
  )
}

export default Home
