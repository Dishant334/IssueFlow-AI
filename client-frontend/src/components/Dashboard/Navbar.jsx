import React from 'react'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const navigate=useNavigate()
  const Logout=()=>{
    localStorage.removeItem("token")
    navigate('/', { state: { message: "Logged out successfully" }})
  }
  return (
    <div className='h-16 px-12 flex items-center justify-between bg-slate-200'>
      <p className=' text-2xl'>Dashboard</p>
         <div className="relative group overflow-hidden p-0.5 bg-white/20  h-9 w-32 rounded-md active:scale-100 hover:scale-105 transition-all duration-300">
            <button onClick={Logout} className="text-white text-sm bg-linear-to-t from-blue-800 to-blue-400 h-full w-full rounded cursor-pointer" >
                Logout
            </button>
            <div className="absolute -bottom-12 group-hover:-bottom-10 transition-all duration-200 left-1/2 -z-10 -translate-x-1/2 blur size-14 rounded-full bg-white"></div>
        </div>
      </div>
    
  )
}

export default Navbar
