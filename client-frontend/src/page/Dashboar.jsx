import React, { useEffect, useState } from 'react'
import Navbar from '../components/Dashboard/Navbar'
import { Link, Outlet } from 'react-router-dom'
import {CirclePlus, FolderKanban, House, StickyNote, User} from 'lucide-react'
import Workspace from '../components/Dashboard/Workspace'
import { addWorkspace, getWorkspaces } from '../apiHelper/workspace'
import toast from 'react-hot-toast'



const Dashboar = () => {
  const [title,setTitle]=useState('')
  const [active,setActive]=useState("home")
  const [openForm,setOpenForm]=useState(false)
  const [workspaces,setWorkspaces]=useState([])
  const [reload,setReload]=useState(false)
  {/*handling functionsfor new workspace form */}
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

const inactiveState=" text-center  text-indigo-400  tracking-wider border-y border-indigo-500  px-4 py-1 transition-all duration-300  hover:text-white  hover:shadow-[0_0_25px_8px_rgba(99,102,241,0.8)]"
const activeState="text-center border-y border-indigo-500  px-4 py-1  text-white  transition-all duration-300"

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
    <div className='flex gap-4'>
      {/*left sidebar*/}
       <div className='w-1/5 min-h-screen bg-slate-900'>
       {/*Logo*/}
          <div className='flex justify-center'>
            <img src="/logo.png" className='h-32' alt="" />
          </div>
        {/*Workspace*/}
        <div className='text-white mb-8 px-4'>
             <div className='flex justify-between px-2'><p className='text-sm text-gray-500'>Workspaces</p> <button onClick={()=>setOpenForm(true)} className='transform transition-transform duration-300 hover:scale-125'><CirclePlus size={12}/></button></div>
            <Workspace workspaces={workspaces}/>
            </div>  
        {/*buttons*/}
          <div className='flex flex-col gap-3'>
            <Link onClick={()=>{setActive('home')}} className={active==='home' ? `${activeState}`:`${inactiveState}`}to="home"><div  className="flex items-center gap-2"><House size={18}/> Home</div></Link>
            <Link onClick={()=>{setActive("tasks")}} className={active==='tasks'? `${activeState}`:`${inactiveState}`}to="tasks"><div  className="flex items-center gap-2"><StickyNote  size={18}/> My Tasks</div></Link>
            <Link onClick={()=>{setActive("projects")}} className={active==='projects'?`${activeState}`:`${inactiveState}`} to="projects"><div  className="flex items-center gap-2"><FolderKanban  size={18}/> My Projects</div></Link>
            <Link onClick={()=>{setActive("members")}} className={active==='members'? `${activeState}`:`${inactiveState}`} to="members"><div  className="flex items-center gap-2"><User  size={18}/> Members</div></Link>
           <Link onClick={()=>{setActive("settings")}} className={active==='settings'? `${activeState}`:`${inactiveState}`} to="settings"><div  className="flex items-center gap-2"><User  size={18}/> Settings</div></Link>
          </div>
       </div>
      {/*right content*/}
      <div className='w-4/5 min-h-screen bg-slate-100'>
      <Navbar/>
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
