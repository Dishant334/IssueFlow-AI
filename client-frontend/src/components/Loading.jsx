import React from 'react'

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      
      <div className="group w-[320px] rounded-2xl border border-white/15 
                      bg-white/10 backdrop-blur-xl p-10 text-center
                      transition-all duration-300 ease-out
                      hover:-translate-y-1 hover:shadow-lg">

        {/* Normal Loader */}
        <div className="mx-auto mb-6 h-12 w-12 rounded-full 
                        border-4 border-white/20 
                        border-t-white
                        animate-spin" />

        <h2 className="text-white text-lg font-semibold">
           IssueFlow AI
        </h2>

        <p className="mt-2 text-sm text-white/70">
          Loading, please wait…
        </p>
      </div>

    </div>
  )
}

export default Loading
