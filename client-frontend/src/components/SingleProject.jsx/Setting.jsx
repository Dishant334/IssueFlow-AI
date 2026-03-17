import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../../configs/api'
import { useState } from 'react'
const Setting = () => {
  const navigate=useNavigate()
  const {projectId,workspaceid}=useParams()
  const token=localStorage.getItem('token')
  const {singleProject}=useOutletContext()
    {/*Edit Project Details*/}
    const [editDetails,setEditDetails]=useState({name:'',desc:''})
    const handleSubmit=async(e)=>{
      e.preventDefault()
      try{
      const response=await api.patch(`/api/projects/${projectId}`,{name:editDetails.name,description:editDetails.desc},{headers:{Authorization:`Bearer ${token}`}})
         navigate(`/workspace/${workspaceid}/projects`)
      window.location.reload()
      toast.success(`Project Details Edited Successfully`)
    }catch(err){
      toast.error(err?.response?.data?.message || "Something went wrong")
    }
  }
    const handleInput=(e)=>{
       setEditDetails((prev=>({...prev,[e.target.name]:e.target.value})))
    }

    {/**Archive/Active button functionalities*/}
  const statuses=async(status)=>{
    const confirm=window.confirm("Are You Sure To Change The Status Of Project ??")
    if(!confirm) return;
    try{
      await api.patch(`/api/projects/${projectId}/archive`,{status},{headers:{Authorization:`Bearer ${token}`}})
      navigate(`/workspace/${workspaceid}/projects`)
      window.location.reload()
      toast.success(`Project ${status} successful`)
    
    }catch(err){
      toast.error(err.response?.data?.message || "Something went wrong")
    }
  }

  {/**Delete project functionality*/}
  const deleteProject=async()=>{
    try{
      const confirm=window.confirm('Are You Sure To Delete This Project')
      if(!confirm) return
     const response=await api.delete(`/api/projects/${projectId}`,{headers:{Authorization:`Bearer ${token}`}})
       navigate(`/workspace/${workspaceid}/projects`)
       window.location.reload()
       toast.success(response?.data?.message)
    }catch(err){
      toast.error(err.response?.data?.message)
    }
  }
  return (
     <div className='p-6'>
      <div className="flex justify-between items-center mb-4">
    <p className='text-2xl font-semibold'>Project Settings</p>  
      </div>

  <p className="text-xl font-semibold text-gray-800 mx-4">
    Edit Project Details
  </p>

  <hr className="border-t border-gray-200 my-2 mx-4" />
     <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6">
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">
        Project Name
      </label>
      <input
        type="text"
        name="name"
        placeholder="Enter project name"
        onChange={handleInput}
        className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">
        Project Description
      </label>
      <textarea
        onChange={handleInput}
        name="desc"
        placeholder="Project description"
        rows="4"
        className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none"
      ></textarea>
    </div>

    <button
      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
    >
      Change
    </button>

  </form>
</div>
    <hr className='my-8'/>

<div className='text-red-700 text-xl mx-4'>Danger Zone</div>
<hr className="border-t border-gray-200 my-2 mx-4" />
    <div className='flex justify-evenly my-4'>

  {singleProject?.projectStatus === "active"?(
  <div className="flex items-center">
    <button onClick={()=>statuses('archived')} className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-sm">
      Archive Project
    </button>
  </div>):( <div className="flex items-center">
    <button onClick={()=>statuses('active')} className="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-sm">
      Activate Project
    </button>
  </div>)
}
      <button onClick={deleteProject} className='px-4 py-1 bg-red-600 rounded-xl text-red-800 cursor-pointer'>Delete Project</button>
      </div>
    </div>
  )
}

export default Setting
