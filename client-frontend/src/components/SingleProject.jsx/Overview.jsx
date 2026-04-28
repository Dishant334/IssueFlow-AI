import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../../configs/api'

const Overview = () => {
  const { singleProject } = useOutletContext()
  const { workspaceid, projectId } = useParams()
  const token = localStorage.getItem('token')
  const {loading}=useOutletContext()
  const [data, setData] = useState([])

  const fetchTasks = async () => {
    try {
      const response = await api.get(
        `/api/workspace/${workspaceid}/projects/${projectId}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setData(response.data.tasks)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something Went Wrong")
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId, workspaceid])

  const completed = data.filter((m) => m.status === 'done')
  const inprogress = data.filter((m) => m.status === 'in_progress')
  const pending = data.filter((m) => m.status === 'todo')

  const total = data.length
  const progress = total ? Math.round((completed.length / total) * 100) : 0
    if(loading){
      return  <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
  <div className="w-10 h-10 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
</div>
    }
  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl font-semibold text-white">Overview</p>
      </div>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Total */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:scale-[1.02] transition">
          <p className="text-slate-400 text-sm">Total Tasks</p>
          <p className="text-2xl font-bold text-white mt-1">{total}</p>
        </div>

        {/* Completed */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:scale-[1.02] transition">
          <p className="text-slate-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{completed.length}</p>
        </div>

        {/* In Progress */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:scale-[1.02] transition">
          <p className="text-slate-400 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{inprogress.length}</p>
        </div>

        {/* Pending */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:scale-[1.02] transition">
          <p className="text-slate-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{pending.length}</p>
        </div>

      </div>

      {/* 🔥 Progress Bar */}
      <div className="mt-6">
        <p className="text-sm text-slate-400 mb-2">Progress</p>

        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-xs text-slate-400 mt-1">{progress}% completed</p>
      </div>

      {/* 🔥 Recent Tasks */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 mt-6">
        <p className="text-lg font-semibold text-white mb-4">Recent Tasks</p>

        {data.length === 0 ? (
          <p className="text-slate-400 text-sm">No tasks yet 🚀</p>
        ) : (
          data.slice(0, 5).map((m) => (
            <div
              key={m._id}
              className="flex justify-between items-center py-2 border-b border-slate-700 last:border-none"
            >
              <p className="text-slate-300">{m.title}</p>
              <span className="text-xs text-slate-400 capitalize">
                {m.status.replace('_', ' ')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* 🔥 Members */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 mt-6">
        <p className="text-lg font-semibold text-white mb-4">Members</p>

        {singleProject?.projectMembers?.map((m) => (
          <div key={m._id} className="flex items-center gap-3 py-2">

            {/* Avatar */}
            <div className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
              {m.name?.charAt(0)}
            </div>

            <p className="text-slate-300">
              {m.name}
              {m.role === 'project_admin' && (
                <span className="text-xs text-slate-400 ml-2">(Admin)</span>
              )}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Overview