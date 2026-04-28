import React from 'react'
import {ArrowRight, CircleCheckBig, FileUser, FolderOpen, User} from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import api from '../../../configs/api'
import { useEffect } from 'react'
import CountUp from 'react-countup'
import {motion} from 'framer-motion'

const DashboardHome = () => {
  const[data,setData]=useState({})
  const {workspaceid}=useParams()
  const navigate=useNavigate()
  const token=localStorage.getItem('token')
  const [loading,setLoading]=useState(false)

   const fetchData=async()=>{
    setLoading(true)
    try{
      const response=await api.get(`/api/workspace/${workspaceid}/home`,{headers:{Authorization:`Bearer ${token}`}})
       setData(response.data)
       setLoading(false)
    }catch(err){
      toast.error(err?.response?.data?.message || 'Something went wrong')
      setLoading(false)
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
    if(loading){
      return  <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
  <div className="w-10 h-10 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
</div>
    }
  return (
    <div>
      <div className='m-4'>
        <p className='font-semibold text-3xl text-slate-100'>Home</p>
        <p className='text-sm text-slate-400 mt-1 max-w-md'>Monitor all of your projects and tasks here</p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-2 lg:flex lg:justify-evenly mt-12 gap-6 mx-8'>
        <motion.div 
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.5,delay:0.2}}
        className='bg-slate-800 border border-slate-700 rounded-xl p-4 gap-12  flex justify-between  min-w-56 hover:bg-slate-700 transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]  hover:scale-[1.03]'>
          <div>
          <p className='text-sm text-slate-400'>Total Projects</p>
          <p className='text-2xl font-semibold text-slate-100 mt-1'><CountUp end={data?.dashboard?.stats?.totalProjects || 0} duration ={1.5} enableScrollSpy delay={.3}/></p>
          </div>
           <FolderOpen className='bg-slate-700 text-blue-400 rounded-md p-2' size={30}/>
        </motion.div>
          <motion.div 
           initial={{opacity:0,y:-20}}
           animate={{opacity:1,y:0}}
           transition={{duration:0.5,delay:0.2}}
          className='bg-slate-800 border border-slate-700 rounded-xl p-4 gap-12  flex justify-between  min-w-56 hover:bg-slate-700 transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]  hover:scale-[1.03]'>
          <div>
          <p className='text-sm text-slate-400'>Total Tasks</p>
          <p className='text-2xl font-semibold text-slate-100 mt-1'>{<CountUp end={data?.dashboard?.stats?.totalTasks || 0} duration={1.5} enableScrollSpy delay={.3}/>}</p>
          </div>
           <User className='bg-slate-700 text-purple-400 rounded-md p-2' size={30}/>
        </motion.div>
          <motion.div 
           initial={{opacity:0,y:-20}}
          animate={{opacity:1,y:0}}
           transition={{duration:0.5,delay:0.2}}
          className='bg-slate-800 border border-slate-700 rounded-xl p-4 gap-12  flex justify-between  min-w-56 hover:bg-slate-700 transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]  hover:scale-[1.03]'>
          <div>
          <p className='text-sm text-slate-400'>Assigned Tasks</p>
          <p className='text-2xl font-semibold text-slate-100 mt-1'>{<CountUp end={data?.dashboard?.stats?.assignedTasks || 0} duration={1.5} enableScrollSpy delay={.3}/>}</p>
          </div>
           <FileUser className='bg-slate-700 text-yellow-400 rounded-md p-2' size={30}/>
        </motion.div>
          <motion.div
           initial={{opacity:0,y:-20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5,delay:0.2}}
          className='bg-slate-800 border border-slate-700 rounded-xl p-4 gap-12  flex justify-between  min-w-56 hover:bg-slate-700 transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]  hover:scale-[1.03]'>
          <div>
          <p className='text-sm text-slate-400'>Completed Tasks</p>
          <p className='text-2xl font-semibold text-slate-100 mt-1'><CountUp end={data?.dashboard?.stats?.completedTasks || 0} duration={1.5} enableScrollSpy delay={.3}/></p>
          </div>
             <CircleCheckBig className='bg-slate-700 text-green-400 rounded-md p-2' size={30}/>
        </motion.div>
      </div>
        
      <div className='w-full flex mt-8 gap-4  '>
          {/**Projects */}
        <div className=' w-4/6  border mx-4  border-slate-700 hover:bg-slate-950  rounded-xl p-4 transition-all duration-400'>
          <div className='flex justify-between items-center mb-4'>
            <p className='text-lg font-semibold text-slate-100'>Recent Projects</p>
            <div onClick={()=>onClick('project')} className='flex cursor-pointer transition-all duration-300 transform hover:scale-110'>
            <button className='text-sm text-blue-400 hover:text-blue-300'>View All</button>
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
        className="flex items-center justify-between p-3 rounded-md bg-slate-900 hover:bg-slate-800 hover:shadow-sm transition-all duration-300 hover:scale-[1.01] space-y-3 cursor-pointer"
      >
        <div>
          <p className="text-sm font-semibold text-slate-100">
            {m.name}
          </p>
          <p className="text-xs text-gray-400">
            Recently created
          </p>
        </div>

        <span className="text-xs px-2 py-1  bg-slate-700 text-slate-300  rounded-full hover:bg-slate-900">
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
        {/**Tasks */}
        <div className=' w-2/6  px-4  mx-4 bg-slate-800 hover:bg-slate-900 rounded-lg p-3 transition duration-400'>
        <div className='flex justify-between mx-2'>
            <p className='text-white text-md font-bold'>My Recent Tasks</p>
             <div onClick={()=>onClick('task')} className='flex cursor-pointer transition-all duration-300 transform hover:scale-110'>
            <button className='text-sm text-blue-400 hover:text-blue-300'>View All</button>
            <ArrowRight   size={16} className='mt-1 text-gray-400'/>
          </div>
          </div>
          <hr className="border-gray-200 my-4" />
          <div className="mx-4 space-y-3">
  {data?.dashboard?.myTasks?.length > 0 ? (
    data.dashboard.myTasks.map((task) => (
      <div
        key={task._id}
        className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:shadow-sm transition-all duration-300 cursor-pointer spae-y-3 hover:scale-[1.01] "
      >
        {/* Title */}
        <p className="text-sm font-semibold text-slate-100">
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
                ? "bg-blue-500/10 text-blue-400 text-xm px-2 rounded-full py-1"
                : task.status === "in_progress"
                ? "bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded-full"
                : " bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full"
            }`}
          >
            {task.status}
          </span>

          {/* Priority */}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              task.priority === "high"
                ? "bg-red-500/10 text-red-400"
                : task.priority === "medium"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-green-500/10 text-green-400"
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
