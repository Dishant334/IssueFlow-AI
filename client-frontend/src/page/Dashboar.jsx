import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import {ChevronDown, CirclePlus, FolderKanban, House, StickyNote, User} from 'lucide-react'
import Workspace from '../components/Dashboard/Workspace'
import { addWorkspace, getWorkspaces } from '../apiHelper/workspace'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../../configs/api'


const Dashboar = () => {
  const location=useLocation()
  const [title,setTitle]=useState('')
  const [name,setName]=useState('')
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
  localStorage.removeItem('token')
  navigate('/')
}

useEffect(()=>{fetchData()},[workspaceid])

const limitChars = (text, limit = 5) => {
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
    <div className='relative flex '>
      {/*left sidebar*/}
       <div className='w-1/7 min-h-screen bg-black px-4 h-screen sticky top-0 '>
       {/*Name+Avatar*/}
          <div onClick={()=>setModel((prev)=>!prev)}  className='flex cursor-pointer text-sm justify-center mt-8'>
            <div className='flex text-gray-300 font-semibold gap-1'>
             <div><p className='text-md bg-[#1E293B] text-[#3B82F6] px-1 rounded-xl'>{twoLetter(name)}</p></div>
             <h1 className='text-md'>{limitChars(name)}</h1>
             <ChevronDown size={20}  className='text-gray-300 cursor-pointer'/>
            </div>
          </div>
          {model && <div className='absolute flex justify-center ml-10  mt-2 w-40 bg-[#1f2937]   border border-gray-700 overflow-hidden z-50  rounded-lg text-slate-100'>
            <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white transition duration-200'>Logout</button>
            </div>}
        {/*Workspace*/}
        <div className='text-white my-8 px-4'>
             <div className='flex justify-between px-2'><p className='text-sm text-[#9CA3Af]'>Workspaces</p> <button onClick={()=>setOpenForm(true)} className='transform transition-transform duration-300 hover:scale-125'><CirclePlus size={12} className='text-[#6B7280] hover:text-[#E5E7EB]'/></button></div>
            <Workspace workspaces={workspaces}/>
            </div>  
        {/*buttons*/}
          <div className='flex flex-col gap-3'>
            <Link  className={isActive('home') ? `${activeState}`:`${inactiveState}`}to="home"><div  className="flex items-center gap-2"><House size={18}/> Home</div></Link>
            <Link  className={isActive('tasks')? `${activeState}`:`${inactiveState}`}to="tasks"><div  className="flex items-center gap-2"><StickyNote  size={18}/> My Tasks</div></Link>
            <Link  className={isActive('projects')?`${activeState}`:`${inactiveState}`} to="projects"><div  className="flex items-center gap-2"><FolderKanban  size={18}/> My Projects</div></Link>
            <Link  className={isActive('members')? `${activeState}`:`${inactiveState}`} to="members"><div  className="flex items-center gap-2"><User  size={18}/> Members</div></Link>
           <Link  className={isActive('settings')? `${activeState}`:`${inactiveState}`} to="settings"><div  className="flex items-center gap-2"><User  size={18}/> Settings</div></Link>
          </div>
       </div>
      {/*right content*/}
      <div className='w-6/7 min-h-screen bg-[#0B1220]'>
      
      
       {openForm ? <div onClick={(e)=>setOpenForm(false)} className='fixed z-20 flex items-center justify-center min-h-3/4 min-w-3/4 backdrop:blur-md'>
<form onSubmit={handleNewWorkspaceSubmit} onClick={(e)=>e.stopPropagation()} className=" flex flex-col w-96 p-8 rounded-2xl bg-white shadow-lg shadow-indigo-200/40 transition-all duration-300 hover:shadow-xl">
  <p className="text-center text-xl font-semibold text-indigo-600 mb-6">
    Add New Workspace </p>
  <input value={title} onChange={handleNewWorkspaceInput}
    className=" px-4 py-3 rounded-lg border border-indigo-200  focus:ring-4 focus:ring-indigo-300/40 transition"
    placeholder="Workspace title"/>
  <button  type="submit" className="cursor-pointer mt-8 py-3 rounded-lg  bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition">Add Workspace</button>
</form>
       </div> : ''}
      <Outlet/>
      </div>
    </div>
  )
}

export default Dashboar
