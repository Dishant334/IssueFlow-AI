import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWorkspaces } from '../apiHelper/workspace'
import Loading from '../components/Loading'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'

// the sections below the first screens are loaded as separate files, right after the page has painted
const loadAiFeatures = () => import('../components/AiFeatures')
const loadDemoVideo = () => import('../components/DemoVideo')
const loadWorkFlow = () => import('../components/WorkFlow')
const loadCTA = () => import('../components/CTA')
const loadFooter = () => import('../components/Footer')
const AiFeatures = lazy(loadAiFeatures)
const DemoVideo = lazy(loadDemoVideo)
const WorkFlow = lazy(loadWorkFlow)
const CTA = lazy(loadCTA)
const Footer = lazy(loadFooter)


const Home = () => {
      const featuresRef = useRef(null)
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
      const preload = () => [loadAiFeatures, loadDemoVideo, loadWorkFlow, loadCTA, loadFooter].forEach((load) => load())
      const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 400))
      idle(preload)
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
      {/* the page sits above the footer (z-10), so the footer is uncovered as the CTA scrolls away */}
      <main id="main" className="relative z-10">
        <Header/>
        <Hero
         scrollToFeatures={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })}
/>

        <div ref={featuresRef}>
          <Features/>
        </div>
        <Suspense fallback={null}>
          <AiFeatures/>
          <DemoVideo/>
          <WorkFlow/>
          <CTA/>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer/>
      </Suspense>
    </div>
  )
}

export default Home
