import React from 'react'
import CreateProject from '../CreateProject/CreateProject'
import { useState } from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../../../configs/api'
import { Link, Outlet, useParams } from 'react-router-dom'

const DashboardAllProject = () => {
  const [openForm,setOpenForm]=useState(false)
  const [allProject,setAllProject]=useState([])
  const [refresh,setRefresh]=useState(false)
  const token=localStorage.getItem('token')
  const {workspaceid}=useParams()
  const [loading,setLoading]=useState(false)
  const allProjects=async()=>{
    setLoading(true)
    try{
      const response =await api.get(`/api/workspace/${workspaceid}/projects`,{headers:{Authorization:`Bearer ${token}`}})
      setAllProject(response.data)
    }catch(err){
      toast.error(err.response?.data?.message || "Something went wrong")
    }finally{
      setLoading(false)
    }
  }
  const onclose=()=>{
    setOpenForm(false)
  }
  const NewPojectForm=()=>{
      setOpenForm(true)
  }
  useEffect(()=>{
    allProjects()
  },[refresh,workspaceid])

  useEffect(() => {
    if (openForm) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [openForm])

  

  const {projectId}=useParams()
  if(projectId){
    return (
      < Outlet />)
  }else{
     if(loading){
    return   <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
  <div className="w-10 h-10 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
</div>
  }
    if(allProject.length > 0){
  return (
    <div className='flex-col items-center justify-center '>
      <div className='flex justify-between m-4'>
      <div >
        <p className='font-semibold text-3xl text-slate-100'>My Projects</p>
        <p className='text-sm text-slate-400 mt-1 max-w-md'>Manage and organise your projects</p>
      </div>
     <div className='flex'>
      <button className='py-2 px-4 mr-8 cursor-pointer bg-blue-500/10 text-blue-400 border border-blue0500/30 hover:bg-blue-500/20 transition-all duration-200 rounded-xl' onClick={()=>NewPojectForm()}>Add New Project</button>
     </div>
     </div>
     <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {  
        allProject.map((p)=>{      
          return (
           <Link
  key={p._id}
  to={`/workspace/${workspaceid}/projects/${p._id}`}
  className="
  group
  bg-slate-800/60 backdrop-blur-md
  border border-slate-700
  rounded-xl p-5 w-full
  hover:border-blue-500/40
  hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]
  hover:-translate-y-1
  transition-all duration-300
"
>
  {/* Top Row */}
  <div className="flex items-center justify-between mb-3">
    
    {/* Project Initial Avatar */}
    <div className="h-10 w-10 flex items-center justify-center rounded-lg 
      bg-blue-500/10 text-blue-400 font-semibold">
      {p.name[0].toUpperCase()}
    </div>

    {/* Status */}
    <span className={`text-xs px-2 py-1 rounded-md font-medium
      ${p.status === "active" 
        ? "bg-green-500/10 text-green-400" 
        : "bg-slate-500/10 text-slate-400"}
    `}>
      {p.status}
    </span>
  </div>

  {/* Project Name */}
  <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-400 transition">
    {p.name}
  </h3>

  {/* Description */}
  <p className="text-slate-400 text-sm line-clamp-2">
    {p.description}
  </p>

  {/* Footer */}
  <div className="mt-4 text-xs text-slate-500 flex justify-between items-center">
    <span>
      {new Date(p.createdAt)
        .toLocaleDateString("en-IN")}
    </span>

    <span className="opacity-0 group-hover:opacity-100 transition">
      →
    </span>
  </div>
</Link>
          )
        
        })
      }
        </div>
     </div>
     {openForm && <CreateProject onclose={onclose} setRefresh={setRefresh}/>}
    </div>
  )}else if(!loading){
    return(
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">

  {/* Heading */}
  <h1 className="text-3xl font-semibold text-white mb-2">
    My Projects
  </h1>

  <p className="text-slate-400 max-w-md mb-8">
    Manage and organize your projects in one place. Create your first project to get started.
  </p>

  {/* Empty State Card */}
  <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-10 backdrop-blur-md shadow-md max-w-md w-full">

    <p className="text-slate-300 text-lg mb-6">
      🚀 No projects yet
    </p>

    {/* CTA Button */}
    <button
      className="px-5 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all duration-200"
      onClick={() => NewPojectForm()}
    >
      + Create Your First Project
    </button>

  </div>
   {openForm && <CreateProject onclose={onclose} setRefresh={setRefresh}/>}
</div>
    )
}
}
}

export default DashboardAllProject
