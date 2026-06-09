import React, { useEffect, useRef } from 'react'
import Banner from '../components/Banner'
import Hero from '../components/Hero'
import Features from '../components/Features'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import AiFeatures from '../components/AiFeatures'
import DemoVideo from '../components/DemoVideo'
import WorkFlow from '../components/WorkFlow'


const Home = () => {
      const featuresRef = useRef(null)
      const contactRef = useRef(null)
     
     useEffect(() => {
  window.history.scrollRestoration = "manual";
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}, []);
 
  return (
    <div>
      <Hero
       scrollToFeatures={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })}
        scrollToContact={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}/>

       <div ref={featuresRef}> 
      <Features/>
      </div>
      <AiFeatures/>
      <DemoVideo/>
      <WorkFlow/>
      <CTA/>
      <div ref={contactRef}>
      <Footer/>
      </div>
    </div>
  )
}

export default Home
