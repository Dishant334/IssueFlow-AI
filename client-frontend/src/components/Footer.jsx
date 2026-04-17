import React from 'react'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full bg-linear-to-b from-[#F1EAFF] to-[#FFFFFF] text-gray-800"
    >

      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="flex items-center space-x-3 mb-6"
        >
          <img alt="/" className="h-32 " src="logo.png" />
        </motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center max-w-xl text-sm font-normal leading-relaxed"
        >
          Empowering creators worldwide with the most advanced AI content creation tools. Transform your ideas into reality.
        </motion.p>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal"
        >
          <a href="https://prebuiltui.com">IssueFlow AI</a> ©2026. All rights reserved.
        </motion.div>
      </div>

    </motion.footer>
  )
}

export default Footer