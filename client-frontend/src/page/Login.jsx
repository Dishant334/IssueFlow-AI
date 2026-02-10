import api from '../../configs/api'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-hot-toast'
import { getWorkspaces } from '../apiHelper/workspace'

const Login = () => {
  
const navigate=useNavigate()
  
      const [login,setLogin]=useState({
        email:'',
        password:''
    })
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
    // 1️⃣ Login first
    const res = await api.post('/api/users/login', login);

    toast.success('Login Successful');
    setLogin({ email: '', password: '' });
    localStorage.setItem("token", res.data.token);

    // 2️⃣ NOW fetch workspaces (token exists)
    const workspaceData = await workspaces();

    // 3️⃣ Navigate based on data
    if (workspaceData.length === 0) {
      navigate('/createWorkspace');
    } else {
      navigate(`/workspace/${workspaceData[0].id}`);
    }

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
<div className='flex justify-center items-center h-screen w-screen bg-amber-100 '>
        <div className='w-100 border-2 z-10 bg-amber-200'>
             <form onSubmit={handleSubmit} action="" className='flex flex-col gap-10  p-4'>
                <input type="email" className='h-8 p-4' placeholder='Email' name="email" value={login.email} onChange={handleInput}/>
                <input type="password" className='h-8 p-4' placeholder='Password' name="password" value={login.password} onChange={handleInput}/>
                  <div className='flex justify-between'>
                  <button type='submit' className='bg-blue-700 w-28 h-8 rounded-full cursor-pointer'>Login</button>
                  <p>Not a member? <button type='button' onClick={toRegister} className='text-yellow-400 cursor-pointer'>Sign Up</button></p>
                  </div>
             </form>
        </div>
      
    </div>
  )
}

export default Login
