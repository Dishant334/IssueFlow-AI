import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = ({scrollToFeatures,scrollToContact}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <section className='relative flex flex-col items-center overflow-hidden bg-linear-to-b from-[#E0E7FF] via-[#F5F3FF] to-[#FAF5FF] px-4 py-4'>

      {/*  Background Glow (back layer) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.15),transparent_60%)]"></div>

      {/*  Floating Blobs (middle layer) */}
      <div className="absolute inset-0 z-1 overflow-hidden">

        {/* Left Blob */}
        <div className="absolute w-96 h-96 bg-violet-500/50 rounded-full blur-2xl top-20 left-20 animate-blob"></div>

        {/* Right Blob */}
        <div className="absolute w-96 h-96 bg-indigo-500/50 rounded-full blur-2xl bottom-20 right-20 animate-blob animation-delay-2000"></div>

        {/* Center Glow */}
        <div className="absolute w-125 h-125 bg-purple-500/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between gap-8 bg-white/70 backdrop-blur-md border border-white/40 shadow-sm rounded-full px-4 md:px-2  w-full max-w-3xl z-2">
        <Link to="/" className='flex items-center'>
          <img src="logo.png" className='w-28' />
        </Link>

        <div className='w-0.5 h-8 bg-gray-100 hidden md:flex'></div>

        <div className={`max-md:absolute max-md:bg-white/70 max-md:h-screen max-md:overflow-hidden max-md:transition-[width] max-md:duration-300 max-md:top-0 max-md:left-0 max-md:flex-col max-md:justify-center max-md:backdrop-blur flex items-center gap-8 z-50 md:gap-10 flex-1 ${mobileOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
          <button onClick={() => {setMobileOpen(false)
                                 scrollToFeatures()}} 
        className="text-gray-600 hover:text-gray-800 text-sm">Features</button>
          <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-gray-800 text-sm">Login</Link>
          <Link to="/register" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-gray-800 text-sm">Sign Up</Link>
        <button onClick={() => {setMobileOpen(false)
                                 scrollToContact()}}
        className="text-gray-600 hover:text-gray-800 text-sm">Contact Us</button>
        </div>

        <div className="flex items-center gap-2 md:pr-1">
          <Link to="/register" className="hidden md:inline-block bg-violet-600 hover:bg-violet-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm transition-all duration-200 hover:scale-105 active:scale-95">
            Get Started
          </Link>

          <button onClick={() => setMobileOpen(true)} className="md:hidden text-gray-700 p-2 rounded-md">
            ☰
          </button>
        </div>
      </nav>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 px-4 py-1.5 mt-24 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm z-2"
      >
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
          <span className="relative inline-flex size-2 rounded-full bg-green-600"></span>
        </span>
        <p className="text-sm text-black/60">Smarter project tracking for modern teams</p>
      </motion.div>

      {/*  Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-4xl md:text-[66px]/[1.2] text-center max-w-2xl mt-8 text-gray-800 leading-tight font-medium z-2'
      >
        Manage Projects. Track Issues. Ship Faster.
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-sm text-gray-600 text-center max-w-xl mt-4 z-2"
      >
        IssueFlow is an AI-integrated project management platform that helps teams plan work, track progress, and deliver efficiently.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className='flex gap-3 mt-10 z-2'
      >
        <Link to="/register" className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">
          Get Started Now
        </Link>

        <Link to="/" className="bg-white hover:bg-violet-50 border border-violet-400 text-gray-600 text-sm px-5 py-3 rounded-lg transition-all duration-200 hover:scale-105">
          View Features
        </Link>
      </motion.div>

      {/* Divider */}
      <div className='w-full max-w-3xl h-0.5 mt-10 bg-linear-to-r from-transparent via-violet-500 to-transparent z-2'></div>

    </section>
  )
}

export default Hero