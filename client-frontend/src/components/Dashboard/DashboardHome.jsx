import React from 'react'
import {ArrowRight, CircleCheckBig, FileUser, FolderOpen, User} from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import api from '../../../configs/api'
import { useEffect } from 'react'
const DashboardHome = () => {
  const[data,setData]=useState({})
  const {workspaceid}=useParams()
  const navigate=useNavigate()
  const token=localStorage.getItem('token')
   const fetchData=async()=>{
    try{
      const response=await api.get(`/api/workspace/${workspaceid}/home`,{headers:{Authorization:`Bearer ${token}`}})
       setData(response.data)
    }catch(err){
      toast.error(err?.response?.data?.message || 'Something went wrong')
    }
   }

   const onClick=(param)=>{
    if(param=='task'){
    navigate(`/workspace/${workspaceid}/tasks`)
    }else{
    navigate(`/workspace/${workspaceid}/projects`)
    }
   }
   useEffect(()=>
    {fetchData()
    },[workspaceid,token])
  return (
    <div>
      <div className='m-4'>
        <p className='font-semibold text-lg'>Home</p>
        <p className='text-sm'>Monitor all of your projects and tasks here</p>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-2 lg:flex lg:justify-evenly mt-12 gap-6 mx-8'>
        <div className='border border-gray-400 p-4 gap-12 rounded-sm flex justify-between  min-w-56'>
          <div>
          <p className='text-sm text-gray-500'>Total Projects</p>
          <p className='text-2xl font-semibold'>{data?.dashboard?.stats?.totalProjects}</p>
          </div>
           <FolderOpen className='bg-blue-300 text-blue-600 rounded-md p-0.5' size={30}/>
        </div>
          <div className='border border-gray-400 p-4 gap-12 rounded-sm flex  justify-between min-w-56'>
          <div>
          <p className='text-sm text-gray-500'>Total Tasks</p>
          <p className='text-2xl font-semibold'>{data?.dashboard?.stats?.totalTasks}</p>
          </div>
           <User className='bg-purple-300 text-purple-600 rounded-md p-0.5' size={30}/>
        </div>
          <div className='border border-gray-400 p-4 gap-12 rounded-sm flex justify-between  min-w-56'>
          <div>
          <p className='text-sm text-gray-500'>Assigned Tasks</p>
          <p className='text-2xl font-semibold'>{data?.dashboard?.stats?.assignedTasks}</p>
          </div>
           <FileUser className='bg-yellow-300 text-yellow-600 rounded-md p-0.5' size={30}/>
        </div>
          <div className='border border-gray-400 p-4 gap-12 rounded-sm flex justify-between  min-w-56'>
          <div>
          <p className='text-sm text-gray-500'>Completed Tasks</p>
          <p className='text-2xl font-semibold'>{data?.dashboard?.stats?.completedTasks}</p>
          </div>
             <CircleCheckBig className='bg-green-300 text-green-600 rounded-md p-0.5' size={30}/>
        </div>
      </div>
        
      <div className='w-full flex mt-8 gap-4  '>
        <div className=' w-4/6  px-4 border mx-4  border-gray-200'>
          <div className='flex justify-between'>
            <p className='text-sm text-gray-400'>Recent Projects</p>
            <div onClick={()=>onClick('project')} className='flex cursor-pointer transform hover:scale-125'>
            <button className='text-sm text-gray-400'>View All</button>
            <ArrowRight   size={16} className='mt-1 text-gray-400'/>
          </div>
          </div>
          <hr className="border-gray-200 my-4" />
          <div className='mx-4'>
               <div className='mx-4'>
        <div className="mx-4 space-y-3">
  {data?.dashboard?.recentProjects?.length > 0 ? (
    data.dashboard.recentProjects.map((m) => (
      <div
        key={m._id}
        className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition cursor-pointer"
      >
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {m.name}
          </p>
          <p className="text-xs text-gray-400">
            Recently created
          </p>
        </div>

        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
          Project
        </span>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-400 text-center py-4">
      No recent projects
    </p>
  )}
</div>
          </div>
          </div>
        </div>
        <div className=' w-2/6  px-4 border mx-4 border-gray-200'>
        <div className='flex justify-between mx-2'>
            <p className='text-gray-400 text-sm'>My Recent Tasks</p>
             <div onClick={()=>onClick('task')} className='flex cursor-pointer transform hover:scale-125'>
            <button className='text-sm text-gray-400'>View All</button>
            <ArrowRight   size={16} className='mt-1 text-gray-400'/>
          </div>
          </div>
          <hr className="border-gray-200 my-4" />
          <div className="mx-4 space-y-3">
  {data?.dashboard?.myTasks?.length > 0 ? (
    data.dashboard.myTasks.map((task) => (
      <div
        key={task._id}
        className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition cursor-pointer"
      >
        {/* Title */}
        <p className="text-sm font-semibold text-gray-800">
          {task.title}
        </p>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Bottom row */}
        <div className="flex justify-between items-center mt-3">
          
          {/* Status */}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              task.status === "todo"
                ? "bg-blue-100 text-blue-600"
                : task.status === "in_progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-600"
            }`}
          >
            {task.status}
          </span>

          {/* Priority */}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              task.priority === "high"
                ? "bg-red-100 text-red-600"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-400 text-center py-4">
      No tasks assigned
    </p>
  )}
</div>
        </div>
        
          
      </div>

    </div>
  )
}

export default DashboardHome
