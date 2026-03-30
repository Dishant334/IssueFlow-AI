import React, { useState } from 'react'
import KanbanBoard from '../KanbanBoard/KanbanBoard'

const Tasks = () => {
  const [openForm,setOpenForm]=useState(false)

  const onClose=()=>{
    setOpenForm(false)
  }
  return (
    <div className='relative p-6' >
      <div className="flex justify-between items-center mb-4">
    <p className='text-2xl font-semibold'>Tasks</p>
    <button onClick={()=>setOpenForm(true)} className='p-2 bg-blue-400  rounded-lg'>ADD TASK</button>
    
      </div>
      <div>  
     <KanbanBoard openForm={openForm} onClose={onClose}/>
     </div>
    </div>
  )
}

export default Tasks
