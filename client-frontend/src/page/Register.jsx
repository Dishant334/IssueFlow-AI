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
    <div className='flex justify-center items-center h-screen w-screen bg-amber-100 '>
        <div className='w-100 border-2 z-10 bg-amber-200'>
             <form onSubmit={handleSubmit} action="" className='flex flex-col gap-10  p-4'>
                <input type="text" className='h-8 p-4' placeholder='Username' name="name" value={register.name} onChange={handleInput}/>
                <input type="email" className='h-8 p-4' placeholder='Email' name="email" value={register.email} onChange={handleInput}/>
                <input type="password" className='h-8 p-4' placeholder='Password' name="password" value={register.password} onChange={handleInput}/>
                  <div className='flex justify-between'>
                  <button type='submit' className='bg-blue-700 w-28 h-8 rounded-full cursor-pointer'>Sign Up</button>
                  <p>Already a member? <button type="button" onClick={toLogin} className='text-yellow-400 cursor-pointer'>Login</button></p>
                  </div>
             </form>
        </div>
      
    </div>
  )
}

export default Register
