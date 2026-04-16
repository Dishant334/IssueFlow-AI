import api from '../../configs/api'
import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'




const Register = () => {
      const navigate=useNavigate()

    const [register,setRegister]=useState({
    name:'',
    email:'',
    password:''
})

    const handleSubmit=(e)=>{
      e.preventDefault()
      console.log(register)
            api.post("/api/users/register",register)
            .then(()=>{
               toast.success("SignUp Sucess Login Now")
               setRegister({...register,name:'',email:'',password:''})
                navigate('/login')     
            }).catch((err)=>{
               toast.error("Something went wrong")
            })

    }
    const handleInput=(e)=>{
        setRegister({
       ...register,[e.target.name]:e.target.value
    })
    }

  
    const toLogin=()=>{
       navigate('/login') 
    }
  return (
    <div className='relative min-h-screen flex items-center justify-center bg-[#e6ecf3] overflow-hidden'>

       <div className="absolute w-72 h-72 bg-purple-400 opacity-30 rounded-full blur-md top-10 left-10"></div>
         <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-md bottom-10 right-10"></div>
          <div className="absolute w-64 h-64 bg-indigo-400 opacity-30 rounded-full blur-md top-1/2 left-1/4"></div>
          <div className="absolute w-40 h-40 bg-gray-400 opacity-30 rounded-full blur-md top-5 right-1/4 "></div>

        <div className='relative z-10 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl p-8 shadow-xl min-h-84'>
             <form onSubmit={handleSubmit} action="" className='flex flex-col gap-10  p-4'>
                <input type="text" className='h-8 p-4 hover:border-2 border-gray-400 rounded-lg focus:outline-none' placeholder='Username' name="name" value={register.name} onChange={handleInput}/>
                <input type="email"  className='h-8 p-4 hover:border-2 border-gray-400 rounded-lg focus:outline-none' placeholder='Email' name="email" value={register.email} onChange={handleInput}/>
                <input type="password" className='h-8 p-4 hover:border-2 border-gray-400 rounded-lg focus:outline-none' placeholder='Password' name="password" value={register.password} onChange={handleInput}/>
                  <div className='flex justify-between gap-8'>
                  <button type='submit' className='bg-blue-700 w-28 h-8 rounded-full cursor-pointer'>Sign Up</button>
                  <p>Already a member? <button type="button" onClick={toLogin} className='text-yellow-400 cursor-pointer'>Login</button></p>
                  </div>
             </form>
        </div>
      
    </div>
  )
}

export default Register
