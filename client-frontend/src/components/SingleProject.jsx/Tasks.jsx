import React from 'react'
import KanbanBoard from '../KanbanBoard/KanbanBoard'

const Tasks = () => {
  return (
    <div className='p-6'>
      <div className="flex justify-between items-center mb-4">
    <p className='text-2xl font-semibold'>Tasks</p>  
     <KanbanBoard/>
      </div>
    </div>
  )
}

export default Tasks
