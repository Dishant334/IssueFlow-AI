import React from 'react'
import Banner from '../components/Banner'
import Hero from '../components/Hero'
import Features from '../components/Features'
import CTA from '../components/CTA'
import Testimonial from '../components/Testimonial'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Banner/>
      <Hero/>
      <Features/>
      <Testimonial/>
      <CTA/>
      <Footer/>
    </div>
  )
}

export default Home
