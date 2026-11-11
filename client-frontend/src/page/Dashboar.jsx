import React, { Suspense, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import {ChevronDown, CirclePlus, FolderKanban, House, Menu, StickyNote, User, X} from 'lucide-react'
import Workspace from '../components/Dashboard/Workspace'
import { addWorkspace, getWorkspaces } from '../apiHelper/workspace'
import socket from '../socket'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../../configs/api'


const Dashboar = () => {
  const location=useLocation()
  const [title,setTitle]=useState('')
  const [name,setName]=useState('')
  const [menuOpen,setMenuOpen]=useState(false)   // the sidebar is a drawer on small screens
  const [mode,setMode]=useState(localStorage.getItem('theme')==='light' ? 'light' : 'dark')
  const toggleMode=()=>{
    const next=mode==='dark' ? 'light' : 'dark'
    localStorage.setItem('theme',next)
    setMode(next)
  }
  const isActive = (path) => location.pathname.includes(path)
  const [openForm,setOpenForm]=useState(false)
  const [workspaces,setWorkspaces]=useState([])
  const [reload,setReload]=useState(false)
  const {workspaceid}=useParams()
  const token=localStorage.getItem('token')
  const [model,setModel]=useState(false)

  const fetchData=async()=>{
    try{
    const response=await api.get(`/api/workspace/${workspaceid}/details`,{headers:{Authorization:`Bearer ${token}`}})
    setName(response.data.details.username)
    }catch(err){
      toast.error(err?.response?.data?.message || 'Something went wrong')
    }
}
 const navigate=useNavigate()
const handleLogout=()=>{
  socket.disconnect()
  api.post('/api/users/logout',{refreshToken:localStorage.getItem('refreshToken')})   //removes it from db
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  navigate('/')
}

useEffect(()=>{fetchData()},[workspaceid])

const limitChars = (text) => {
    if(!text) return '';
  
  const words=text.split(' ');
  return words[0]
};

const twoLetter=(text)=>{
  if(!text) return '';
  
  const words=text.split(' ');
  if(words.length==1){
    return words[0].slice(0,2)
  }else{
    return words[0][0]+words[1][0]
  }
}

  {/*handling functions for new workspace form */}
  const handleNewWorkspaceInput=(e)=>{
    setTitle(e.target.value)
  }
 const handleNewWorkspaceSubmit = async (e) => {
  e.preventDefault();
  try {
    await addWorkspace(title.trim());
    toast.success("New Workspace Added Successfully");
    console.log("Submitting workspace:", title.trim());
    await allWorkspaces();
    setReload(true)
    setTitle('');
    setOpenForm(false);
  } catch (err) {
    console.error("Error adding workspace:", err.response?.data || err.message);
    toast.error("Failed to add workspace");
  }
};
const inactiveState = "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
const activeState = "flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-gray-800 text-white"

const allWorkspaces=async()=>{
  try{
     const response=await getWorkspaces()
     setWorkspaces(response)
  }catch(err){
    err.message?.response
  }
}

useEffect(() =>{allWorkspaces()},[reload])


  return (
    <div className={`theme-ember ${mode==='light' ? 'theme-light' : ''} relative flex`}>
      {menuOpen && <div onClick={()=>setMenuOpen(false)} className='fixed inset-0 z-30 bg-black/60 lg:hidden'></div>}
      {/*left sidebar*/}
       <div className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-slate-950 px-4 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-1/7 lg:min-w-44 lg:shrink-0 lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={()=>setMenuOpen(false)} aria-label='Close menu' className='absolute right-3 top-3 text-slate-400 hover:text-white lg:hidden'><X size={20}/></button>
       {/*Name+Avatar*/}
          <div onClick={()=>setModel((prev)=>!prev)}  className='flex cursor-pointer text-sm justify-center mt-8'>
            <div className='flex text-gray-300 font-semibold gap-1'>
             <div><p className='text-md bg-slate-800 text-blue-400 px-1 rounded-xl'>{twoLetter(name)}</p></div>
             <h1 className='text-md'>{limitChars(name)}</h1>
             <ChevronDown size={20}  className='text-gray-300 cursor-pointer'/>
            </div>
          </div>
          {model && <div className='absolute flex justify-center ml-10  mt-2 w-40 bg-slate-800   border border-gray-700 overflow-hidden z-50  rounded-lg text-slate-100'>
            <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white transition duration-200'>Logout</button>
            </div>}
        {/*Workspace*/}
        <div className='text-white my-8 px-4'>
             <div className='flex justify-between px-2'><p className='text-sm text-slate-400'>Workspaces</p> <button onClick={()=>setOpenForm(true)} className='transform transition-transform duration-300 hover:scale-125'><CirclePlus size={12} className='text-[#6B7280] hover:text-[#E5E7EB]'/></button></div>
            <Workspace workspaces={workspaces}/>
            </div>  
        {/*buttons*/}
          <div onClick={()=>setMenuOpen(false)} className='flex flex-col gap-3'>
            <Link  className={isActive('home') ? `${activeState}`:`${inactiveState}`}to="home"><div  className="flex items-center gap-2"><House size={18}/> Home</div></Link>
            <Link  className={isActive('tasks')? `${activeState}`:`${inactiveState}`}to="tasks"><div  className="flex items-center gap-2"><StickyNote  size={18}/> My Tasks</div></Link>
            <Link  className={isActive('projects')?`${activeState}`:`${inactiveState}`} to="projects"><div  className="flex items-center gap-2"><FolderKanban  size={18}/> My Projects</div></Link>
            <Link  className={isActive('members')? `${activeState}`:`${inactiveState}`} to="members"><div  className="flex items-center gap-2"><User  size={18}/> Members</div></Link>
           <Link  className={isActive('settings')? `${activeState}`:`${inactiveState}`} to="settings"><div  className="flex items-center gap-2"><User  size={18}/> Settings</div></Link>
          </div>
       </div>
      {/*right content*/}
      <div className='min-h-screen min-w-0 flex-1 bg-slate-900'>
      {/*top bar, only on small screens*/}
      <div className='sticky top-0 z-30 flex items-center gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3 lg:hidden'>
        <button onClick={()=>setMenuOpen(true)} aria-label='Open menu' className='text-slate-300 hover:text-white'><Menu size={22}/></button>
        <p className='font-semibold text-slate-100'>IssueFlow</p>
      </div>
       {openForm ? <div onClick={()=>setOpenForm(false)} className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
<form onSubmit={handleNewWorkspaceSubmit} onClick={(e)=>e.stopPropagation()} className=" flex flex-col w-96 max-w-full p-8 rounded-2xl bg-white shadow-lg shadow-indigo-200/40 transition-all duration-300 hover:shadow-xl">
  <p className="text-center text-xl font-semibold text-indigo-600 mb-6">
    Add New Workspace </p>
  <input value={title} onChange={handleNewWorkspaceInput}
    className=" px-4 py-3 rounded-lg border border-indigo-200  focus:ring-4 focus:ring-indigo-300/40 transition"
    placeholder="Workspace title"/>
  <button  type="submit" className="cursor-pointer mt-8 py-3 rounded-lg  bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition">Add Workspace</button>
</form>
       </div> : ''}
      <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500"></div></div>}>
        <Outlet context={{mode,toggleMode}}/>
      </Suspense>
      </div>
    </div>
  )
}

export default Dashboar
