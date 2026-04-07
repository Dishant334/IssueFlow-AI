import React from 'react'
import { TableRowsSplit, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import api from '../../../configs/api'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

const DashboardSettings = () => {
const [detail,setDetail]=useState({})
const [name,setName]=useState('')
const[email,setEmail]=useState('')
const [workspaceName,setWorkspaceName]=useState('')
const {workspaceid}=useParams()
const token=localStorage.getItem('token')

const fetchData=async()=>{
    try{
    const response=await api.get(`/api/workspace/${workspaceid}/details`,{headers:{Authorization:`Bearer ${token}`}})
    setDetail(response.data.details)
    }catch(err){
      toast.error(err?.response?.data?.message || 'Something went wrong')
    }
}

useEffect(() => {
  if (detail?.username) {  setName(detail.username) }
  if(detail?.workspacename){ setWorkspaceName(detail.workspacename)}
  if(detail?.email){setEmail(detail.email)}
}, [detail])

useEffect(()=>{fetchData()},[workspaceid])



  return (
    <div className='p-4'>
      
      {/* Header */}
      <p className='text-3xl font-semibold'>Settings</p>
      <p className='text-sm text-gray-500 mt-1'>
        Manage your workspace settings and members
      </p>

      <div className='mt-4 space-y-8'>

        {/* User Details */}
        <div>
          <p className='text-lg font-semibold mb-4'>User Details</p>

          <div className='flex items-end gap-10 flex-wrap'>
            
            <div className='flex flex-col'>
              <label className='text-xs text-gray-500 mb-1'>Name</label>
              <input
                type="text"
                placeholder='Enter name'
                value={name}
                className='px-3 py-2 w-64 bg-gray-300 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none'
              />
            </div>

            <div className='flex flex-col'>
              <label className='text-xs text-gray-500 mb-1'>Email</label>
              <input
                type="text"
                placeholder='Enter email'
                value={email}
                className='px-3 py-2 w-64 bg-gray-200 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none'
                disabled
              />
            </div>

            <button className='h-10 px-4 rounded-md bg-linear-to-r from-blue-900 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition'>
              Update Profile
            </button>

          </div>
        </div>

        {/* Workspace Details */}
        <div>
          <div className='flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>Workspace Details</h1>

            <div className='text-xs text-gray-500 text-right'>
              <p>Created By: {detail.workspacecreating || '--'} </p>
              <p>Created On: {detail.workspacecreatedOn ||'--'}</p>
            </div>
          </div>

          <div className='flex items-end gap-10 mt-4 flex-wrap'>
            <div className='flex flex-col'>
              <label className='text-xs text-gray-500 mb-1'>
                Workspace Name
              </label>
              <input
                type="text"
                placeholder='Workspace name'
                value={workspaceName}
                className='px-3 py-2 w-80 bg-gray-300 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none'
              />
            </div>

            <button className='h-10 px-4 rounded-md bg-linear-to-r from-blue-900 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition'>
              Save Changes
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className='bg-red-50 border border-red-200 rounded-xl mx-10 p-8'>
          
          {/* Header */}
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-700" size={22} />
            <span className="text-xl font-semibold text-red-700">
              Danger Zone
            </span>
          </div>

          {/* Description */}
          <p className='mt-4 text-sm text-gray-700 leading-relaxed max-w-xl'>
            The following actions are destructive and cannot be undone. Please be certain before proceeding.
          </p>
          <p className='text-sm text-gray-700'>
            Leaving a workspace will revoke all your access immediately.
          </p>

          {/* Buttons */}
          <div className='mt-6 flex gap-4'>
            <button className='text-red-700 font-medium px-4 py-2 border border-red-300 rounded-md hover:bg-red-100 transition'>
              Leave Workspace
            </button>

            <button className='text-white font-medium px-4 py-2 bg-red-700 rounded-md hover:bg-red-800 transition'>
              Delete Workspace
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default DashboardSettings