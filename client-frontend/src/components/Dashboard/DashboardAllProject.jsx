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
  const allProjects=async()=>{
    try{
      const response =await api.get(`/api/workspace/${workspaceid}/projects`,{headers:{Authorization:`Bearer ${token}`}})
      setAllProject(response.data)
    }catch(err){
      toast.error(err.response?.data?.message || "Something went wrong")
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
    if(allProject.length >= 1){
  return (
    <div className='relative flex-col items-center justify-center min-h-150'>
      <div className='flex justify-center my-1'>
      <h1 className='text-gray-400 text-4xl'>All Projects</h1>
    </div>
     <div className='flex justify-center my-8'>
      <button className='p-2 px-4 cursor-pointer bg-linear-to-r from-purple-400 to-purple-600 rounded-xl' onClick={()=>NewPojectForm()}>Add New Project</button>
     </div>
     <div>
      <div className='flex flex-wrap gap-8'>
      {  
        allProject.map((p)=>{      
          return (
            <Link  key={p._id} to={`/workspace/${workspaceid}/projects/${p._id}`} className=' bg-linear-to-br from-indigo-200 to-purple-200 border border-indigo-300 p-3 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
              <div className='flex jusitfy-center rounded-t-xl bg-linear-to-r from-indigo-400 to-violet-400 p-6'>
                <p className='mx-auto text-white font-bold drop-shadow-md tracking-wide text-5xl'>{p.name.split(" ")[0][0].toUpperCase()}{p.name.split(" ")[1][0].toUpperCase()}</p>
                </div>
              <p className='text-center text-xl text-gray-800 '>{p.name}</p>
              <p className='text-slate-600 text-sm text-center '>{p.description}</p>
              <div className='flex justify-between gap-6 py-2'>
              <p className={`px-3 py-.5${p.status==='active' ?  'text-blue-700  bg-indigo-300': 'text-gray-400 bg-gray-200'} font-semibold  text-sm rounded-lg `}>{p.status}</p>
              <p>{new Date(p.createdAt).toLocaleString('en-IN',{timeZone:"Asia/Kolkata"}).split(',')[0]}</p>
              </div>
              </Link>
          )
        
        })
      }
        </div>
     </div>
     {openForm && <CreateProject onclose={onclose} setRefresh={setRefresh}/>}
    </div>
  )}else{
  <div className='flex my-20 mx-auto'><p className='text-lg'>No Projects Yet</p></div>
}
}
}

export default DashboardAllProject
