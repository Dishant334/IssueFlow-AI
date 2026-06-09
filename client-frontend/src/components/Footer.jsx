import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative overflow-hidden w-full bg-[#2A223A] text-white"
    >
      {/* Glow Orb */}
      <div className="absolute bottom-0 right-20 size-56 rounded-full bg-purple-500/20 blur-3xl"></div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[8rem] md:text-[12rem] font-bold text-white/3 select-none">
          ISSUEFLOW
        </h1>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            src="logo.png"
            alt="IssueFlow Logo"
            className="h-40 mb-4"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="max-w-xl text-center text-white/60 text-sm leading-relaxed"
          >
            Manage projects, collaborate with teams, and track progress
            effortlessly. Built for modern teams that value speed, clarity, and
            productivity.
          </motion.p>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8 mt-8 text-sm text-white/60"
          >
            <a href="#" className="hover:text-white transition-colors">
              Features
            </a>

            <a href="https://www.instagram.com/" className="hover:text-white transition-colors">
              Instagram
            </a>

            <a href="https://www.linkedin.com/in/dishant-kumar-codes/" className="hover:text-white transition-colors">
              LinkedIn
            </a>

            <a href="https://github.com/Dishant334" className="hover:text-white transition-colors">
              GitHub
            </a>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6">
          <p className="text-center text-sm text-white/50">
            © 2026 IssueFlow. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;