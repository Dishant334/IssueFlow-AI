import api from '../../configs/api'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {EyeClosed,Eye} from 'lucide-react';
import { inputClass, labelClass, buttonClass } from '../components/AuthLayout'




const Register = () => {
      const navigate=useNavigate()
      const location=useLocation()
      const params=new URLSearchParams(location.search)
      const redirect=params.get('redirect')
      const loginPath=redirect ? `/login?redirect=${redirect}` : '/login'

    const [register,setRegister]=useState({
    name:'',
    email:'',
    password:''
})

 const [showPassword,setShowPassword]=useState(false)
 const [passwordError,setPasswordError]=useState('')

    const handleSubmit=(e)=>{
      e.preventDefault()
      if(!register.password){
        setPasswordError('Please enter a valid password')
        return
      }
      if(register.password.length <6){
        setPasswordError(`Please enter atleast 6 digits`)
        return
      }

            api.post("/api/users/register",register)
            .then(()=>{
               toast.success("SignUp Sucess Login Now")
               setRegister({...register,name:'',email:'',password:''})
                navigate(loginPath,{state:{email:register.email}})
            }).catch((err)=>{
               toast.error(err.response?.data?.message || "Something went wrong")
            })

    }
    const handleInput=(e)=>{
        setRegister({
       ...register,[e.target.name]:e.target.value
    })
    }

  
    const toLogin=()=>{
       navigate(loginPath)
    }
  return (
    <>
      <h1 className="font-display text-3xl font-semibold text-[#FAF7F2]">Create your account</h1>
      <p className="mt-2 text-sm text-slate-400">It is free, and takes less than a minute.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>Username</label>
          <input id="name" type="text" name="name" autoComplete="name" value={register.name} onChange={handleInput} placeholder="Your name" className={inputClass} />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" type="email" name="email" autoComplete="email" value={register.email} onChange={handleInput} placeholder="you@example.com" className={inputClass} />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={register.password}
              onChange={handleInput}
              placeholder="At least 6 characters"
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
          {passwordError && <p className="auth-shake mt-1.5 text-sm text-[#DE8C7F]">{passwordError}</p>}
        </div>

        <button type="submit" className={`${buttonClass} mt-2`}>Create account</button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already a member?{' '}
        <button type="button" onClick={toLogin} className="cursor-pointer font-medium text-[#E0825B] hover:underline">Log in</button>
      </p>
    </>
  )
}

export default Register
