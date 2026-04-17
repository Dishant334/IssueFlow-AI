import api from '../../configs/api'
import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {EyeClosed,Eye} from 'lucide-react';




const Register = () => {
      const navigate=useNavigate()

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
                <input type="text" className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition' placeholder='Username' name="name" value={register.name} onChange={handleInput}/>
                <input type="email"  className='w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition' placeholder='Email' name="email" value={register.email} onChange={handleInput}/>


                 {/* Password */}
                          <div className="relative w-full">
                           <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={register.password}
                            onChange={handleInput}
                           placeholder="Password"
                           className="w-full px-4 py-2  pr-10 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                           />
               
                          {/* Eye Icon */}
                           <button
                           type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                           >
                          {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                          {passwordError && (
                           <p className="text-red-500 text-sm ml-3 ">{passwordError}</p>
                             )}
                            </div>
                           
                            
               
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
