import React from 'react'
import { useOutletContext } from 'react-router-dom'

const Overview = () => {
  const {singleProject}=useOutletContext()
  return (
    <div className='p-6'>
      <div className="flex  justify-between items-center mb-4">
    <p className='text-2xl font-semibold'>Overview</p>
    </div>

    
    <div className='mx-4'>
    <div className='flex items-center justify-between my-4  gap-8'>
      <p className=' text-blue-500'>Total tasks:</p>
      <p className='text-green-500'>Completed:</p>
      <p className='text-orange-500'>In Progress:</p>
      <p className='text-gray-500'>Pending:</p>
    </div>
    <hr class="border-t border-gray-300 my-4"></hr>

      <div>
      <p className='text-lg my-2'>Recent Tasks:</p>
      <hr class="border-t border-gray-300 my-4"></hr>
      </div>  
      
      <div >
        <p className='text-lg my-2'>Members:</p>
        <hr class="border-t border-gray-300 my-4"></hr>
        {singleProject?.projectMembers?.map(m =>{
          return(
              <ul className='list-disc pl-5' key={m.name}>
                <li className='mx-2 '>
                  <p>{m.name} ({m.role==='project_admin' && m.role})</p>
                  </li>

              </ul>
          )
        })}
      </div>
      </div>
      </div>

  )
}

export default Overview
