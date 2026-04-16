import React, { useEffect, useState } from 'react'
import api from '../../../configs/api'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Comments from '../Comments/Comments.jsx'

const SingleTaskModal = ({onClose,taskId}) => {
    const [task,setTask]=useState({})
    const {workspaceid,projectId}=useParams()
    const token=localStorage.getItem('token')
    const [text,setText]=useState('')

    const fetchData=async(taskId)=>{
       try{
         const response= await api.get(`/api/workspace/${workspaceid}/projects/${projectId}/tasks/${taskId}`,{headers:{Authorization:`Bearer ${token}`}})
         setTask(response.data.task)
       }catch(err){
         toast.error(err?.response?.data?.message)
       }
    }
    const addText=(e)=>{
       setText(e.target.value)
    }
  
    const addComment=async()=>{
        try{
          const response= await api.post(`/api/workspace/${workspaceid}/project/${projectId}/task/${taskId}/comments`,{text:text},{headers:{Authorization:`Bearer ${token}`}})
          setText('')
        }catch(err){
            toast.err(err?.response?.data?.message)
        }
    }
    
    useEffect(() => {
      if (taskId) {
        fetchData(taskId);
      }
    }, [workspaceid, projectId, taskId]);

  return (
    <div className='absolute inset-0 flex justify-center py-40' onClick={(e)=>e.stopPropagation()}>
        
        {/* Overlay */}
        <div className='absolute inset-0 bg-black/40 backdrop-blur-md min-h-screen ' onClick={onClose}/>

        {/* Modal */}
        <div className='relative bg-white z-10 w-125 min-h-160 rounded-xl shadow-xl p-6 space-y-5'>
            
            {/* Title */}
            <h1 className='text-center font-semibold text-2xl text-gray-800'>
                {task.title}
            </h1>

            {/* Description */}
            <p className='text-center text-sm text-gray-500'>
                {task?.description || "No description provided"}
            </p>
            
            {/* Assignee Info */}
            <div className='flex justify-between px-2 pt-4 text-sm text-gray-600'>
                <p>
                    <span className='font-medium text-gray-700'>Created By:</span> {task.createdBy?.name || "Unknown"}
                </p>
                <p>
                    <span className='font-medium text-gray-700'>Assigned To:</span> {task.assignedTo?.name || "Unassigned"}
                </p>
            </div>

            {/* Status & Priority */}
            <div className='flex justify-between px-2 text-sm'>
                
                <p>
                    <span className='font-medium text-gray-700'>Status: </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-1 ${
                        task.status === "todo"
                        ? "bg-blue-100 text-blue-600"
                        : task.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-600"
                    }`}>
                        {task.status}
                    </span>
                </p>

                <p>
                    <span className='font-medium text-gray-700'>Priority: </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-1 ${
                        task.priority === "high"
                        ? "bg-red-100 text-red-600"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-600"
                    }`}>
                        {task.priority}
                    </span>
                </p>
            </div>

            {/* Comments Section */}
            <div className='px-2 pt-4'>
                <p className='text-lg font-semibold text-gray-800 mb-3'>
                    Comments
                </p>

                {/* Input */}
                <div className='flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300'>
                    <input 
                        type="text" 
                        placeholder='Write a comment...' 
                        value={text}
                        onChange={addText}
                        className='w-full text-sm focus:outline-none'
                    />
                    <button onClick={addComment} className='text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition'>
                        Send
                    </button>
                </div>

                <Comments taskId={taskId}/>
            </div>
            
        </div>

    </div>
  )
}

export default SingleTaskModal