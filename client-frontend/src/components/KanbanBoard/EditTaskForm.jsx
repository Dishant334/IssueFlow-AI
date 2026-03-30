import React, { useEffect, useState } from 'react'
import api from '../../../configs/api'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const EditTaskForm =({onClose,fetchTasks,taskId}) => {
  const {workspaceid,projectId}=useParams()
  const token=localStorage.getItem('token')
  const [Member,setMember]=useState([])
  const [data,setData]=useState({
    title:'',
    description:'',
    status:'',
    priority:'',
    assignedTo:''
  })

  const handleInput=(e)=>{
    setData({...data,[e.target.name]: e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
     const response=await api.patch(`/api/workspace/${workspaceid}/projects/${projectId}/tasks/${taskId}`,data,{headers:{Authorization:`Bearer ${token}`}})
     toast.success(response?.data?.message || 'Task Assigned Successfully')
     onClose()
     await fetchTasks()
    }catch(err){
      toast.error(err?.response?.data?.message || 'Something Went Wrong')
    }






    
  }

  useEffect(() => {
  async function fetchData() {
    const response = await api.get(`/api/workspace/${workspaceid}/members`,{headers:{Authorization:`Bearer ${token}`}})
    setMember(response.data.members)
  }

  fetchData();
}, [workspaceid]);
  return (
    <div className='absolute inset-0 z-40  grid place-items-start justify-center' onClick={(e=>e.stopPropagation())}>
       {/*overlay*/}
       <div className='absolute inset-0 min-h-screen bg-black/40 backdrop-blur-sm' onClick={onClose}/>

       {/**modal */}
       <div className='mt-12  min-w-80 relative z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'>
          <form onSubmit={handleSubmit}>
            <h1 className='text-xl'>Edit task</h1>
            <div className='flex flex-col my-4'>
            <label htmlFor="title">Enter Title</label>
            <input type="text" name='title' value={data.title} onChange={handleInput} placeholder='Enter Title Of Task' className='focus:outline-none text-sm text-gray-400' required/>
            </div>
            <div className='flex flex-col my-4'>
              <label htmlFor="description">Enter Description</label>
              <textarea name="description" value={data.description} onChange={handleInput} className='focus:outline-none text-sm text-gray-400'  id="" placeholder='Enter description'></textarea>
            </div>

          
          <h1 className='mt-4'>Select Priority</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            {["low", "medium", "high"].map((newitem) => (
        <label key={newitem}>
           <input
            type="radio"
           name="priority"
           value={newitem}
           checked={data.priority === newitem}
           onChange={handleInput}
           />
           {newitem}
            </label>
           ))}
         </div>
           <div className='flex flex-col my-4'>
           <label htmlFor="assignedTo">Select Assignee</label> 
           <select  name="assignedTo" value={data.assignedTo}  onChange={handleInput} className='focus:outline-none'>
             <option value="">Select Assignee</option>
            {Member?.map((m,index)=><option  className='bg-gray-300 rounded-md' key={index} value={m.userId}>{m.name}</option>)}
           </select>
           </div>
          <div className='flex justify-center'>
            <button type='submit' className='p-2 bg-linear-to-br from-blue-300 to-blue-600 rounded-lg'>Assign Task</button>
          </div>
          </form>
       </div>
      
    </div>
  )
}

export default EditTaskForm
