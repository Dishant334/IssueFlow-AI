import React, { useState } from 'react'
import Navbar from '../components/Dashboard/Navbar'
import { Link, Outlet } from 'react-router-dom'
import {CirclePlus, FolderKanban, House, StickyNote, User} from 'lucide-react'
import Workspace from '../components/Dashboard/Workspace'



const Dashboar = () => {

  const [active,setActive]=useState("home")

const inactiveState=" text-center  text-indigo-400  tracking-wider border-y border-indigo-500  px-4 py-1 transition-all duration-300  hover:text-white  hover:shadow-[0_0_25px_8px_rgba(99,102,241,0.8)]"
const activeState="text-center border-y border-indigo-500  px-4 py-1  text-white  transition-all duration-300"
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
          
            <p className='text-sm text-gray-500'><div className='flex justify-between px-2'>Workspaces <button><CirclePlus size={12}/></button></div></p>
            <Workspace/>
            </div>  
        {/*buttons*/}
          <div className='flex flex-col gap-6'>
            <Link onClick={()=>{setActive('home')}} className={active==='home' ? `${activeState}`:`${inactiveState}`}to="home"><div  className="flex items-center gap-2"><House size={18}/> Home</div></Link>
            <Link onClick={()=>{setActive("tasks")}} className={active==='tasks'? `${activeState}`:`${inactiveState}`}to="tasks"><div  className="flex items-center gap-2"><StickyNote  size={18}/> My Tasks</div></Link>
            <Link onClick={()=>{setActive("projects")}} className={active==='projects'?`${activeState}`:`${inactiveState}`} to="projects"><div  className="flex items-center gap-2"><FolderKanban  size={18}/> My Projects</div></Link>
            <Link onClick={()=>{setActive("members")}} className={active==='members'? `${activeState}`:`${inactiveState}`} to="members"><div  className="flex items-center gap-2"><User  size={18}/> Members</div></Link>
          </div>
       </div>
      {/*right content*/}
      <div className='w-4/5 min-h-screen bg-slate-100'>
      <Navbar/>
      <Outlet/>
      </div>
    </div>
  )
}

export default Dashboar
