import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from './Logo'
import HeroBoard from './HeroBoard'

const navLink = "relative text-sm text-slate-300 hover:text-white transition after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#E0825B] after:transition-all after:duration-300 hover:after:w-full"

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
    // same warm charcoal + terracotta colours as the dashboard (see .theme-ember in index.css)
    <section className='relative flex flex-col items-center overflow-hidden bg-[#161412] px-4 py-4 pt-28 pb-16'>

      {/* Background: terracotta glow at the top, dotted grid fading out */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,99,60,0.28),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"></div>

      {/* Floating glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#C4552F]/25 rounded-full blur-3xl top-20 -left-10 animate-floatSlow"></div>
        <div className="absolute w-96 h-96 bg-[#A37624]/20 rounded-full blur-3xl bottom-0 -right-10 animate-floatSlow2"></div>
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
  className={`fixed z-50 flex items-center justify-between backdrop-blur-xl
  ${
    scrolled
      ? "bg-[#1F1C19]/80 border border-white/10 shadow-lg shadow-black/30 px-6 py-2.5"
      : "bg-transparent border-b border-white/10 px-4 md:px-10 py-4"
  }`}
>
  {/* Logo */}
  {/* already on the home page, so the link does nothing: scroll to the top instead */}
  <Link
    to="/"
    onClick={(e) => {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }}
    aria-label="IssueFlow, back to top"
  >
    <Logo size={scrolled ? 34 : 40} />
  </Link>

  {/* Nav Links (centered) */}
  <div
    className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:h-screen
    max-md:bg-[#161412]/95 max-md:backdrop-blur-xl
    max-md:flex-col max-md:justify-center
    max-md:overflow-hidden max-md:transition-[width]
    max-md:duration-300 flex items-center justify-center gap-8 md:gap-10 flex-1
    ${mobileOpen ? "max-md:w-full" : "max-md:w-0"}`}
  >

  {/* Close Button */}
  <button
    onClick={() => setMobileOpen(false)}
    className="absolute top-6 right-6 md:hidden text-3xl text-slate-300"
  >
    ✕
  </button>
    <button
      onClick={() => {
        setMobileOpen(false);
        scrollToFeatures();
      }}
      className={navLink}
    >
      Features
    </button>

    <button
      onClick={() => {
        setMobileOpen(false);
        scrollToContact();
      }}
      className={navLink}
    >
      Contact Us
    </button>

    <Link
      to="/login"
      onClick={() => setMobileOpen(false)}
      className={`${navLink} md:hidden`}
    >
      Login
    </Link>

    <Link
      to="/register"
      onClick={() => setMobileOpen(false)}
      className={`${navLink} md:hidden`}
    >
      Sign Up
    </Link>
  </div>

  {/* Auth buttons */}
  <div className="flex items-center gap-3">
    <Link
      to="/login"
      className="hidden md:inline-block text-sm text-slate-300 hover:text-white px-3 py-2 transition"
    >
      Login
    </Link>

    <Link
      to="/register"
      className={`hidden md:inline-block bg-linear-to-r from-[#E0825B] to-[#C4552F]
      text-white rounded-full text-sm font-medium shadow-lg shadow-[#C4552F]/30 transition-all duration-300
      hover:scale-105 hover:shadow-[#C4552F]/50 active:scale-95
      ${scrolled ? "px-5 py-2" : "px-6 py-2.5"}`}
    >
      Get Started
    </Link>

    <button
      onClick={() => setMobileOpen(true)}
      className="md:hidden text-slate-200 text-xl p-2"
    >
      ☰
    </button>
  </div>
</motion.nav>

      <div className="relative z-2 flex w-full max-w-6xl flex-col items-center gap-6 mt-20 lg:flex-row lg:gap-4">

      {/* Left side: text content */}
      <div className="flex flex-1 flex-col items-center lg:items-start">

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 z-2"
      >
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#8DA36B] opacity-75 animate-ping"></span>
          <span className="relative inline-flex size-2 rounded-full bg-[#8DA36B]"></span>
        </span>
        <p className="text-sm text-slate-300">Smarter project tracking for modern teams</p>
      </motion.div>

      {/*  Heading */}
    <motion.h1
  initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  transition={{ duration: 1, ease: "easeOut" }}
  className="text-4xl md:text-[58px]/[1.1] text-center lg:text-left max-w-3xl mt-8 font-semibold z-2
  bg-linear-to-r from-[#FAF7F2] via-[#E0825B] to-[#FAF7F2]
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
        className="text-sm md:text-base text-slate-400 text-center lg:text-left max-w-xl mt-5 z-2"
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
        <Link to="/register" className="bg-linear-to-r from-[#E0825B] to-[#C4552F] text-white text-sm font-medium px-6 py-3 rounded-lg shadow-lg shadow-[#C4552F]/30 transition-all duration-200 hover:scale-105 active:scale-95">
          Get Started Now
        </Link>

        <button onClick={scrollToFeatures} className="bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-sm px-5 py-3 rounded-lg transition-all duration-200 hover:scale-105">
          View Features
        </button>
      </motion.div>

      </div>

      {/* Right side: animated 2D kanban board */}
      <div className="w-full flex-1 flex justify-center lg:justify-end">
        <HeroBoard />
      </div>

      </div>

      {/* fade the bottom edge so the glows do not stop in a hard line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-32 bg-linear-to-b from-transparent to-[#161412]"></div>

    </section>
  )
}

export default Hero
