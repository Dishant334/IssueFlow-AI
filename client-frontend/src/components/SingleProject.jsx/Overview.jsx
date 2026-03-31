import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../../configs/api'

const Overview = () => {
  const {singleProject}=useOutletContext()
  const {workspaceid,projectId}=useParams()
  const token=localStorage.getItem('token')
  const[data,setData]=useState()
   const fetchTasks = async () => {
    try {
      const response = await api.get(
        `/api/workspace/${workspaceid}/projects/${projectId}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.tasks);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something Went Wrong");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId, workspaceid]);

  const completed=data?.filter((m)=>m.status==='done')
  const inprogress=data?.filter((m)=>m.status==='in_progress')
  const pending=data?.filter((m) => m.status==='todo')

  return (
    <div className='p-6'>
      <div className="flex  justify-between items-center mb-4">
    <p className='text-2xl font-semibold'>Overview</p>
    </div>

    
    <div className='mx-4'>
    <div className='flex items-center justify-between my-4  gap-8'>
      <p className=' text-blue-500'>Total tasks: {data?.length}</p>
      <p className='text-green-500'>Completed: {completed?.length}</p>
      <p className='text-orange-500'>In Progress:{inprogress?.length}</p>
      <p className='text-gray-500'>Pending:{pending?.length}</p>
    </div>
    <hr className="border-t border-gray-300 my-4"></hr>

      <div>
      <p className='text-lg my-2'>Recent Tasks:</p>
      <hr className="border-t border-gray-300 my-4"></hr>
         {data?.map(m =>{
          return(
              <ul className='list-disc pl-5' key={m.title}>
                <li className='mx-2 '>
                  <p>{m.title}</p>
                  </li>

              </ul>
          )
        })}
      </div>  
      
      <div >
        <p className='text-lg my-2'>Members:</p>
        <hr className="border-t border-gray-300 my-4"></hr>
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
