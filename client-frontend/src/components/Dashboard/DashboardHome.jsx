import React from 'react'
import {ArrowRight, FolderOpen, Layers, UserCheck, Users} from 'lucide-react'
import ThemeLamp from '../ThemeLamp'
import toast from 'react-hot-toast'
import { useState } from 'react'
import {useNavigate, useOutletContext, useParams} from 'react-router-dom'
import api from '../../../configs/api'
import { useEffect } from 'react'
import CountUp from 'react-countup'
import {motion} from 'framer-motion'

// look of the status chip and the priority dot
const statusStyle = {
  todo: { label: 'Not started', chip: 'bg-slate-500/15 text-slate-300', dot: 'bg-slate-400' },
  in_progress: { label: 'In progress', chip: 'bg-amber-500/15 text-amber-300', dot: 'bg-amber-400' },
  done: { label: 'Done', chip: 'bg-emerald-500/10 text-emerald-300', dot: 'bg-emerald-400' },
}
const priorityStyle = {
  high: { label: 'High', pill: 'bg-red-500/15 text-red-300' },
  medium: { label: 'Medium', pill: 'bg-amber-500/15 text-amber-300' },
  low: { label: 'Low', pill: 'bg-slate-500/20 text-slate-300' },
}

// project avatar gets one of these gradients
const avatarColors = [
  'bg-[#C4552F]',
  'bg-[#738A52]',
  'bg-[#A37624]',
  'bg-[#A0674D]',
  'bg-[#4B7673]',
  'bg-[#8C7B5A]',
]
const avatarColor = (name = '') =>
  avatarColors[(name.charCodeAt(0) || 0) % avatarColors.length]

// names are saved in lower case, so show them with a capital letter
const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1)

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const timeAgo = (date) => {
  const mins = Math.floor((Date.now() - new Date(date)) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const RING = 2 * Math.PI * 34   // circumference of the progress ring

const DashboardHome = () => {
  const[data,setData]=useState({})
  const [user,setUser]=useState({})
  const {workspaceid}=useParams()
  const navigate=useNavigate()
  const {mode,toggleMode}=useOutletContext()
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
    // name for the greeting, the page still works without it
    try{
      const response=await api.get(`/api/workspace/${workspaceid}/details`,{headers:{Authorization:`Bearer ${token}`}})
      setUser(response.data.details)
    }catch{
      setUser({})
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

    const stats=data?.dashboard?.stats || {}
    const assigned=stats.assignedTasks || 0
    const completed=stats.completedTasks || 0
    const open=assigned-completed
    const percent=assigned ? Math.round((completed/assigned)*100) : 0
    const firstName=user?.username ? capitalize(user.username.split(' ')[0]) : ''

    // one line that talks to the user, based on his real numbers
    let summary
    if(assigned===0) summary='Nothing is assigned to you yet. Pick a project and get started.'
    else if(open===0) summary="You're all caught up. Everything assigned to you is done."
    else summary=`You have ${open} open ${open===1 ? 'task' : 'tasks'} waiting for you.`

    if(loading){
      return  <div className="p-6 animate-pulse space-y-6">
        <div className="h-8 w-72 rounded-lg bg-slate-800"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[0,1,2,3].map((i)=><div key={i} className="h-32 rounded-2xl bg-slate-800/70"></div>)}
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 h-72 rounded-2xl bg-slate-800/70"></div>
          <div className="lg:col-span-2 h-72 rounded-2xl bg-slate-800/70"></div>
        </div>
      </div>
    }
  return (
    <div className='relative overflow-x-clip p-6'>
      {/* Lamp: hangs from the top right, pull the cord to switch dark / light */}
      <ThemeLamp mode={mode} toggle={toggleMode} className='absolute right-6 top-0 z-20 md:right-10' />

      {/* Header */}
      <motion.div
        initial={{opacity:0,y:10}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4}}
        className='flex flex-wrap items-end justify-between gap-4 pr-16 md:pr-20'>
        <div>
          {user?.workspacename && (
            <p className='text-xs font-medium uppercase tracking-wider text-slate-500'>{user.workspacename}</p>
          )}
          <h1 className='mt-1 text-3xl font-semibold text-slate-100'>
            {greeting()}{firstName && `, ${firstName}`}
          </h1>
          <p className='mt-1.5 text-slate-400'>{summary}</p>
        </div>
        <div className='flex gap-3'>
          <button onClick={()=>onClick('project')} className='cursor-pointer rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white'>
            All projects
          </button>
          <button onClick={()=>onClick('task')} className='cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500'>
            My tasks
          </button>
        </div>
      </motion.div>

      {/* Numbers */}
      <motion.div
        initial={{opacity:0,y:12}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4,delay:0.08}}
        className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>

        {/* Progress */}
        <div className='flex items-center gap-5 rounded-2xl border border-slate-800 bg-slate-800/40 p-5'>
          <div className='relative h-20 w-20 shrink-0'>
            <svg viewBox='0 0 80 80' className='h-20 w-20 -rotate-90'>
              <circle cx='40' cy='40' r='34' fill='none' strokeWidth='7' className='stroke-slate-700/70'/>
              <motion.circle
                cx='40' cy='40' r='34' fill='none' strokeWidth='7' strokeLinecap='round'
                className='stroke-blue-500'
                strokeDasharray={RING}
                initial={{strokeDashoffset:RING}}
                animate={{strokeDashoffset:RING*(1-percent/100)}}
                transition={{duration:1,delay:0.3,ease:'easeOut'}}
              />
            </svg>
            <p className='absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-100'>{percent}%</p>
          </div>
          <div>
            <p className='text-sm font-medium text-slate-200'>Your progress</p>
            <p className='mt-0.5 text-sm text-slate-400'>
              {completed} of {assigned} {assigned===1 ? 'task' : 'tasks'} done
            </p>
          </div>
        </div>

        {/* Projects */}
        <div className='rounded-2xl border border-slate-800 bg-slate-800/40 p-5'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300'>
            <FolderOpen size={18}/>
          </div>
          <p className='mt-4 text-3xl font-semibold text-slate-100'><CountUp end={stats.totalProjects || 0} duration={1.2}/></p>
          <p className='mt-0.5 text-sm text-slate-400'>{stats.totalProjects===1 ? 'Project' : 'Projects'} in this workspace</p>
        </div>

        {/* Team tasks */}
        <div className='rounded-2xl border border-slate-800 bg-slate-800/40 p-5'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300'>
            <Layers size={18}/>
          </div>
          <p className='mt-4 text-3xl font-semibold text-slate-100'><CountUp end={stats.totalTasks || 0} duration={1.2}/></p>
          <p className='mt-0.5 text-sm text-slate-400'>{stats.totalTasks===1 ? 'Task' : 'Tasks'} across the team</p>
        </div>

        {/* Assigned */}
        <div className='rounded-2xl border border-slate-800 bg-slate-800/40 p-5'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300'>
            <UserCheck size={18}/>
          </div>
          <p className='mt-4 text-3xl font-semibold text-slate-100'><CountUp end={assigned} duration={1.2}/></p>
          <p className='mt-0.5 text-sm text-slate-400'>Assigned to you</p>
        </div>
      </motion.div>

      <div className='mt-6 grid gap-6 lg:grid-cols-5'>
        {/* Projects */}
        <motion.div
          initial={{opacity:0,y:12}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.4,delay:0.16}}
          className='rounded-2xl border border-slate-800 bg-slate-800/30 p-5 lg:col-span-3'>
          <div className='mb-4 flex items-center justify-between'>
            <p className='text-base font-semibold text-slate-100'>Recent projects</p>
            <button onClick={()=>onClick('project')} className='group flex cursor-pointer items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white'>
              View all
              <ArrowRight size={15} className='transition-transform group-hover:translate-x-0.5'/>
            </button>
          </div>

          {data?.dashboard?.recentProjects?.length > 0 ? (
            <div className='space-y-2'>
              {data.dashboard.recentProjects.map((m) => (
                <div
                  key={m._id}
                  onClick={()=>navigate(`/workspace/${workspaceid}/projects/${m._id}`)}
                  onKeyDown={(e)=>e.key==='Enter' && navigate(`/workspace/${workspaceid}/projects/${m._id}`)}
                  role='button'
                  tabIndex={0}
                  className='group flex cursor-pointer items-center gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-slate-700 hover:bg-slate-800/70'>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-semibold text-white ${avatarColor(m.name)}`}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-slate-100'>{capitalize(m.name)}</p>
                    <p className='mt-0.5 truncate text-xs text-slate-400'>{m.description || 'No description yet'}</p>
                  </div>
                  <div className='hidden shrink-0 text-right sm:block'>
                    <p className='flex items-center justify-end gap-1.5 text-xs text-slate-400'>
                      <Users size={13}/>
                      {m.members?.length || 1} {(m.members?.length || 1)===1 ? 'member' : 'members'}
                    </p>
                    <p className='mt-0.5 text-xs text-slate-500'>Started {timeAgo(m.createdAt)}</p>
                  </div>
                  <ArrowRight size={16} className='shrink-0 text-slate-600 transition-colors group-hover:text-slate-300'/>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center rounded-xl border border-dashed border-slate-700 py-10 text-center'>
              <p className='text-sm text-slate-300'>No projects here yet</p>
              <p className='mt-1 text-xs text-slate-500'>Create the first one and it will show up here.</p>
              <button onClick={()=>onClick('project')} className='mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-500'>
                Go to projects
              </button>
            </div>
          )}
        </motion.div>

        {/* Tasks */}
        <motion.div
          initial={{opacity:0,y:12}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.4,delay:0.24}}
          className='rounded-2xl border border-slate-800 bg-slate-800/30 p-5 lg:col-span-2'>
          <div className='mb-4 flex items-center justify-between'>
            <p className='text-base font-semibold text-slate-100'>Your latest tasks</p>
            <button onClick={()=>onClick('task')} className='group flex cursor-pointer items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white'>
              View all
              <ArrowRight size={15} className='transition-transform group-hover:translate-x-0.5'/>
            </button>
          </div>

          {data?.dashboard?.myTasks?.length > 0 ? (
            <div className='space-y-2.5'>
              {data.dashboard.myTasks.map((task) => {
                const status = statusStyle[task.status] || statusStyle.todo
                const priority = priorityStyle[task.priority] || priorityStyle.medium
                return (
                  <div
                    key={task._id}
                    onClick={()=>navigate(`/workspace/${workspaceid}/projects/${task.project}/projectt`)}
                    onKeyDown={(e)=>e.key==='Enter' && navigate(`/workspace/${workspaceid}/projects/${task.project}/projectt`)}
                    role='button'
                    tabIndex={0}
                    className='cursor-pointer rounded-xl border border-slate-700/60 bg-slate-800/70 p-3.5 transition-colors hover:border-slate-600 hover:bg-slate-800'>
                    <div className='flex items-start justify-between gap-3'>
                      <p className='text-sm font-semibold leading-snug text-slate-100'>{task.title}</p>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${priority.pill}`}>{priority.label}</span>
                    </div>
                    {task.description && (
                      <p className='mt-1 line-clamp-1 text-xs text-slate-400'>{task.description}</p>
                    )}
                    <div className='mt-3 flex items-center justify-between'>
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${status.chip}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`}/>
                        {status.label}
                      </span>
                      <span className='text-xs text-slate-500'>Added {timeAgo(task.createdAt)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='flex flex-col items-center rounded-xl border border-dashed border-slate-700 py-10 text-center'>
              <p className='text-sm text-slate-300'>Nothing assigned to you</p>
              <p className='mt-1 text-xs text-slate-500'>When someone gives you a task, it lands here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardHome
