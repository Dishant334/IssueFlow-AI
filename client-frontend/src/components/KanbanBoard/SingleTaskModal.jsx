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
    const [commentSummary,setCommentSummary]=useState('')
    const commentSummaryButton=async(taskId)=>{
        try{
          const response=await api.post('/api/ai/summarize-comments',{issueId:taskId},{headers:{Authorization:`Bearer ${token}`}})
          setCommentSummary(response.data.summary)
        }catch(err){
            toast.error(err?.response?.data?.message || 'Something Went Wrong')
        }
    }
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={onClose}>

  {/* Modal */}
  <div
    onClick={(e) => e.stopPropagation()}
    className="
      w-[95%] max-w-4xl h-[90vh]
      bg-slate-900 border border-slate-700
      rounded-2xl shadow-2xl
      flex flex-col overflow-hidden
    "
  >

    {/* HEADER */}
    <div className="p-6 border-b border-slate-700">
      <h1 className="text-2xl font-semibold text-white">
        {task.title}
      </h1>
      <p className="text-slate-400 text-sm mt-1">
        {task?.description || "No description provided"}
      </p>
    </div>

    {/* BODY */}
    <div className="flex flex-1 overflow-hidden">

      {/* LEFT SIDE */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs mb-1">Created By</p>
            <p className="text-white font-medium">
              {task.createdBy?.name || "Unknown"}
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs mb-1">Assigned To</p>
            <p className="text-white font-medium">
              {task.assignedTo?.name || "Unassigned"}
            </p>
          </div>

          {/* Status */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs mb-1">Status</p>
            <span className={`text-xs px-2 py-1 rounded-md font-medium
              ${task.status === "todo"
                ? "bg-blue-500/10 text-blue-400"
                : task.status === "in_progress"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-green-500/10 text-green-400"
              }`}>
              {task.status}
            </span>
          </div>

          {/* Priority */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs mb-1">Priority</p>
            <span className={`text-xs px-2 py-1 rounded-md font-medium
              ${task.priority === "high"
                ? "bg-red-500/10 text-red-400"
                : task.priority === "medium"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-green-500/10 text-green-400"
              }`}>
              {task.priority}
            </span>
          </div>

        </div>

        {/* COMMENTS SECTION */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">
              Comments
            </h2>

            <button
              onClick={() => commentSummaryButton(taskId)}
              className="
                text-sm px-3 py-1.5 rounded-lg
                bg-linear-to-r from-indigo-500 to-cyan-500
                text-white hover:opacity-90 transition
              "
            >
              ✨ AI Summary
            </button>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Write a comment..."
              value={text}
              onChange={addText}
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-400"
            />
            <button
              onClick={addComment}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-sm transition"
            >
              Send
            </button>
          </div>

          {/* Comments List */}
          <div className="mt-4">
            <Comments taskId={taskId} />
          </div>

          {/* AI Summary Output */}
          {commentSummary && (
            <div className="mt-4 p-4 bg-slate-800 border border-slate-700 rounded-xl">
              <p className="text-sm text-slate-300">
                {commentSummary}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>

  </div>
</div>
  )
}

export default SingleTaskModal