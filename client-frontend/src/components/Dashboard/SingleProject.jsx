import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../../configs/api'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import NavButtons from '../SingleProject.jsx/NavButtons'
const SingleProject = () => {
  const [singleProject,setSingleProject]=useState({})
  const {projectId,workspaceid}=useParams()
  const token=localStorage.getItem("token")
  
  const navigate=useNavigate()
  const SingleProjectData=async ()=>{
    try{
      const response=await api.get(`/api/projects/${projectId}`,{headers:{Authorization:`Bearer ${token}`}})
      setSingleProject(response.data)  
    }catch(err){
      toast.error(err.response?.data?.message ||"Something went wrong")
    }
  }
  {/**Archive/Active button functionalities*/}
  const statuses=async(status)=>{
    const confirm=window.confirm("Are You Sure To change the status of project ??")
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

  useEffect(()=>{
    SingleProjectData()
  },[projectId])
  return (
    <div>

      {/**Project header */}
     <div className="bg-white  border-b border-gray-200 px-12 py-4 flex justify-between items-start">

  {/* LEFT SIDE */}
  <div className="space-y-2">
    {/* Project Name */}
    <p className="text-2xl font-semibold text-gray-800">
      {singleProject.projectName}
    </p>
    {/* Description */}
    <p className="text-sm text-gray-500 max-w-xl">
      {singleProject.projectDescription}
    </p>
    {/* Status Badge */}
    <span className={singleProject.projectStatus === "active" ? `inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-600`:`inline-block text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600`}>
      {singleProject.projectStatus}
    </span>
  </div>

  {/* RIGHT SIDE */}
  {singleProject.projectStatus === "active"?(
  <div className="flex items-center">
    <button onClick={()=>statuses('archived')} className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-sm">
      Archive
    </button>
  </div>):( <div className="flex items-center">
    <button onClick={()=>statuses('active')} className="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-sm">
      Activate
    </button>
  </div>)
}
</div>

{/** navigations buttons*/}
<NavButtons/>

<Outlet context={{singleProject}}/>

    </div>
  )
}

export default SingleProject
