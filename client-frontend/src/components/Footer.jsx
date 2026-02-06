import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="w-full bg-linear-to-b from-[#F1EAFF] to-[#FFFFFF] text-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-6">
                    <img alt="" className="h-11"
                        src="logo.png" />
                </div>
                <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
                    Empowering creators worldwide with the most advanced AI content creation tools. Transform your ideas
                    into reality.
                </p>
            </div>
            <div className="border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
                    <a href="https://prebuiltui.com">IssueFlow AI</a> ©2026. All rights reserved.
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer
