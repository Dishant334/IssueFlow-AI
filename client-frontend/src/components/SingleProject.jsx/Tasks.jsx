import React, { useState } from 'react'
import KanbanBoard from '../KanbanBoard/KanbanBoard'
import { useOutletContext } from 'react-router-dom'

const Tasks = () => {
  const [openForm,setOpenForm]=useState(false)
   const {loading}=useOutletContext()

  const onClose=()=>{
    setOpenForm(false)
  }
   if(loading){
      return  <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
  <div className="w-10 h-10 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
</div>
    }
  return (
    <div className='relative p-6 mx-auto max-w-6xl' >
      <div className="flex justify-between items-center mb-4">
    <p className='text-2xl font-semibold text-slate-100'>Tasks</p>
    <button onClick={()=>setOpenForm(true)} className='p-2 bg-blue-400  rounded-lg'>ADD TASK</button>
    
      </div>
      <div>  
     <KanbanBoard openForm={openForm} onClose={onClose} setOpenForm={setOpenForm}/>
     </div>
    </div>
  )
}

export default Tasks
