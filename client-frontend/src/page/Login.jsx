import api from '../../configs/api'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {toast} from 'react-hot-toast'
import { getWorkspaces } from '../apiHelper/workspace'
import {EyeClosed,Eye} from 'lucide-react';

const Login = () => {
  
const navigate=useNavigate()
const location=useLocation()
const params=new URLSearchParams(location.search)
const redirect=params.get('redirect')
  

      const [login,setLogin]=useState({
        email:'',
        password:''
    })

    const [showPassword,setShowPassword]=useState(false)
    const workspaces=async()=>{
       try{
        const response = await  getWorkspaces()
        return response
      }catch(err){
        throw err.response?.data || err;
      }
    }
    
    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Login first
    const res = await api.post('/api/users/login', login);

    toast.success('Login Successful');
    setLogin({ email: '', password: '' });
    localStorage.setItem("token", res.data.token);

  

    // Navigate based on data
    if(redirect){
      navigate(redirect)
    }else{
        //  NOW fetch workspaces (token exists)
    const workspaceData = await workspaces();
    if (workspaceData.length === 0) {
      navigate('/createWorkspace');
    } else {
      navigate(`/workspace/${workspaceData[0].id}`);
    }}

  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
  }
};
 

    const handleInput=(e)=>{
        setLogin({
       ...login,[e.target.name]:e.target.value
    })
    }
   
    const toRegister=()=>{
       navigate('/register') 
    }
  return (
<div className='relative min-h-screen flex items-center justify-center bg-[#e6ecf3] overflow-hidden'>
          
          <div className="absolute w-72 h-72 bg-purple-400 opacity-30 rounded-full blur-md top-10 left-10"></div>
         <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-md bottom-10 right-10"></div>
          <div className="absolute w-64 h-64 bg-indigo-400 opacity-30 rounded-full blur-md top-1/2 left-1/4"></div>
           <div className="absolute w-40 h-40 bg-gray-400 opacity-30 rounded-full blur-md top-5 right-1/4 "></div>

          {/*glass card*/}
        <div className='relative z-10 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl p-8 shadow-xl min-h-64'>
             <form onSubmit={handleSubmit} action="" className='flex flex-col gap-10  p-4'>
               <div className="flex flex-col gap-6">

  {/* Email */}
          <input
           type="email"
           name="email"
           value={login.email}
           onChange={handleInput}
           placeholder="Email"
           className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
           />

           {/* Password */}
           <div className="relative w-full">
            <input
             type={showPassword ? "text" : "password"}
             name="password"
             value={login.password}
             onChange={handleInput}
            placeholder="Password"
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

           {/* Eye Icon */}
            <button
            type="button"
             onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
           {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
           </button>
             </div>
 
            </div>
                  <div className='flex justify-between gap-8'>
                  <button type='submit' className='bg-blue-700 w-28 h-8 rounded-full cursor-pointer'>Login</button>
                  <p>Not a member? <button type='button' onClick={toRegister} className='text-yellow-400 cursor-pointer'>Sign Up</button></p>
                  </div>
             </form>
        </div>
      
    </div>
  )
}

export default Login
