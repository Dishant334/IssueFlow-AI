import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = ({scrollToFeatures,scrollToContact}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [scrolled,setScrolled]=useState(false)

 useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 120 && !scrolled) {
      setScrolled(true);
    } else if (window.scrollY < 60 && scrolled) {
      setScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [scrolled]);

  return (
    <section className='relative flex flex-col items-center overflow-hidden bg-linear-to-b from-[#E0E7FF] via-[#F5F3FF] to-[#FAF5FF] px-4 py-4 pt-28'>

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

<motion.nav
  animate={{
    width: scrolled ? "88%" : "100%",
    top: scrolled ? 16 : 0,
    left: scrolled ? "50%" : "0%",
    borderRadius: scrolled ? 999 : 0,
    translateX: scrolled ? "-50%" : "0%"
  }}
  transition={{
    type: "spring",
    stiffness: 70,
    damping: 18
  }}
  className={`fixed z-50 flex items-center justify-between border backdrop-blur-xl
  ${
    scrolled
      ? "bg-white/10 border-white/20 px-6 py-3"
      : "bg-transparent border-white/40 px-4 md:px-8 py-4"
  }`}
>
  {/* Logo */}
 <motion.div
  animate={{
    scale: scrolled ? 0.9 : 1
  }}
  transition={{ duration: 0.4 }}
>
  <Link to="/">
    <img src="logo.png" className="w-12" />
  </Link>
</motion.div>

  {/* Divider */}
  <div
    className={`w-px bg-gray-200 hidden md:flex transition-all duration-500 ${
      scrolled ? "h-6" : "h-8"
    }`}
  />

  {/* Nav Links */}
  <div
    className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:h-screen
    max-md:bg-white/90 max-md:backdrop-blur-xl
    max-md:flex-col max-md:justify-center
    max-md:overflow-hidden max-md:transition-[width]
    max-md:duration-300 flex items-center gap-8 md:gap-10 flex-1
    ${mobileOpen ? "max-md:w-full" : "max-md:w-0"}`}
  >

    
  {/* Close Button */}
  <button
    onClick={() => setMobileOpen(false)}
    className="absolute top-6 right-6 md:hidden text-3xl text-gray-700"
  >
    ✕
  </button>
    <button
      onClick={() => {
        setMobileOpen(false);
        scrollToFeatures();
      }}
      className="text-gray-700 hover:text-violet-600 text-sm transition"
    >
      Features
    </button>

    <Link
      to="/login"
      onClick={() => setMobileOpen(false)}
      className="text-gray-700 hover:text-violet-600 text-sm transition"
    >
      Login
    </Link>

    <Link
      to="/register"
      onClick={() => setMobileOpen(false)}
      className="text-gray-700 hover:text-violet-600 text-sm transition"
    >
      Sign Up
    </Link>

    <button
      onClick={() => {
        setMobileOpen(false);
        scrollToContact();
      }}
      className="text-gray-700 hover:text-violet-600 text-sm transition"
    >
      Contact Us
    </button>
  </div>

  {/* CTA */}
  <div className="flex items-center gap-2">
    <Link
      to="/register"
      className={`hidden md:inline-block bg-violet-600 hover:bg-violet-700
      text-white rounded-full text-sm transition-all duration-300
      hover:scale-105 active:scale-95
      ${scrolled ? "px-5 py-2" : "px-6 py-2.5"}`}
    >
      Get Started
    </Link>

    <button
      onClick={() => setMobileOpen(true)}
      className="md:hidden text-gray-700 p-2"
    >
      ☰
    </button>
  </div>
</motion.nav>

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
  initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  transition={{ duration: 1, ease: "easeOut" }}
  className="text-4xl md:text-[66px]/[1.1] text-center max-w-3xl mt-8 font-semibold z-2
  bg-linear-to-r from-gray-900 via-violet-600 to-gray-900
  bg-size-[200%_100%] bg-clip-text text-transparent
  animate-gradient"
>
  <motion.span
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.7 }}
    className="block"
  >
    Manage Projects.
  </motion.span>

  <motion.span
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.45, duration: 0.7 }}
    className="block"
  >
    Track Issues.
  </motion.span>

  <motion.span
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7, duration: 0.7 }}
    className="block"
  >
    Ship Faster.
  </motion.span>
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