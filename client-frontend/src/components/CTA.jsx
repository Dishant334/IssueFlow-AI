import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const CTA = () => {
  const navi=useNavigate()
  const navigate=()=>{
    navi('/register')
  }
  return (
    <motion.div
    initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
     className='relative min-h-100 bg-[#2A223A] flex flex-col  justify-center items-center overflow-hidden'>

      <div className='absolute -top-10 rounded-full size-48 bg-purple-500 blur-3xl opacity-40 glow-bubble'></div>
      <div className='flex flex-col justify-center items-center'>
        <p className='text-4xl cta-display font-extralight md:text-7xl text-amber-50 '>Plan. Track. Deliver.</p>
        <p className='text-4xl cta-display font-extralight md:text-7xl text-amber-50'>Ship Faster</p>
      </div>
      <button onClick={navigate} className='cta-display px-3 py-1 rounded-md text-sm font-semibold bg-amber-50 mt-5 cursor-pointer  
    transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:bg-white active:scale-95'>Get Started-It's Free</button>
    </motion.div>
  )
}

export default CTA
