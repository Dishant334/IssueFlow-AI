import React, { useState } from 'react'
import { addWorkspace } from '../../apiHelper/workspace'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
const CreateWorkspace = () => {

    const navigate=useNavigate()
    const [title,setTitle]=useState('')
    const handleInput=(e)=>{
      setTitle(e.target.value)
    }
   const handleSubmit=async (e)=>{
    e.preventDefault()
    try{
  const res= await addWorkspace(title.trim())
   setTitle('')
   toast.success("✅Workspace Created") 
   const workspaceId = res.newworkspace._id;

  navigate(`/workspace/${workspaceId}`);


    }catch(err){
        console.error(err.response?.data?.message || err);
    }
   }

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-linear-to-br from-blue-300 to-blue-900
                    transition-all duration-500">
      
      <div className=" bg-white/95 backdrop-blur-sm rounded-3xl p-10 w-105 shadow-[0_25px_70px_rgba(0,0,0,0.25)]">
        <h2 className="text-2xl font-semibold  text-center">
         No Workspaces Yet
        </h2>
        <h2 className='text-lg font-semibold mb-6 text-center'>Create Your First Workspace</h2>
         <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
  <input
    value={title}
    onChange={handleInput}
    type="text"
    placeholder="Workspace name"
    className=" w-72  px-4 py-2  rounded-full  border border-gray-300 text-center focus:outline-none  focus:ring-2 focus:ring-blue-400"/>

    <button type="Submit" className='bg-blue-800 cursor-pointer px-4 py-2 rounded-lg hover:py-3'>Create Now!</button>
</form>
     </div>
    </div>

  )
}

export default CreateWorkspace
