import React, { useRef } from 'react'
import Banner from '../components/Banner'
import Hero from '../components/Hero'
import Features from '../components/Features'
import CTA from '../components/CTA'
import Testimonial from '../components/Testimonial'
import Footer from '../components/Footer'

const Home = () => {
      const featuresRef = useRef(null)
      const contactRef = useRef(null)

 
  return (
    <div>
      <Banner/>
      <Hero
       scrollToFeatures={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })}
        scrollToContact={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}/>

       <div ref={featuresRef}> 
      <Features/>
      </div>
      <Testimonial/>
      <CTA/>
      <div ref={contactRef}>
      <Footer/>
      </div>
    </div>
  )
}

export default Home
