import api from '../../configs/api'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {toast} from 'react-hot-toast'
import { getWorkspaces } from '../apiHelper/workspace'
import {EyeClosed,Eye} from 'lucide-react';
import { inputClass, labelClass, buttonClass } from '../components/AuthLayout'

const Login = () => {
  
const navigate=useNavigate()
const location=useLocation()
const params=new URLSearchParams(location.search)
const redirect=params.get('redirect')
  

      const [login,setLogin]=useState({
        email:location.state?.email || '',
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
    localStorage.setItem("refreshToken", res.data.refreshToken);

  

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
       navigate(redirect ? `/register?redirect=${redirect}` : '/register')
    }
  return (
    <>
      <h1 className="font-display text-3xl font-semibold text-[#FAF7F2]">Log in</h1>
      <p className="mt-2 text-sm text-slate-400">Enter your details to open your workspace.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={login.email}
            onChange={handleInput}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm text-slate-400">Password</label>
            <button type="button" onClick={() => navigate('/forgot-password')} className="cursor-pointer text-sm text-[#E0825B] hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              value={login.password}
              onChange={handleInput}
              placeholder="Your password"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-200"
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button type="submit" className={`${buttonClass} mt-2`}>Log in</button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to IssueFlow?{' '}
        <button type="button" onClick={toRegister} className="cursor-pointer font-medium text-[#E0825B] hover:underline">Create an account</button>
      </p>
    </>
  )
}

export default Login
