import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWorkspaces } from '../apiHelper/workspace'
import Loading from '../components/Loading'
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
      const navigate=useNavigate()
      //if the user has a refresh token he is still logged in, so skip the home page
      const [checking,setChecking]=useState(!!localStorage.getItem('refreshToken'))

     useEffect(()=>{
      if(!checking) return
      const goToDashboard=async()=>{
        try{
          const workspaceData=await getWorkspaces()
          if(workspaceData.length===0){
            navigate('/createWorkspace',{replace:true})
          }else{
            navigate(`/workspace/${workspaceData[0].id}`,{replace:true})
          }
        }catch{
          setChecking(false)
        }
      }
      goToDashboard()
     },[])

     useEffect(() => {
  window.history.scrollRestoration = "manual";
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}, []);

  if(checking) return <Loading/>

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
