import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../../configs/api'

const KanbanBoard = () => {
    const [data,setData]=useState()
    const token=window.localStorage.getItem('token')
    const fetch=async()=>{
        try{
            const response=await api.get('/api/workspaces/:workspaceId/project/:projectId/my-tasks',{headers:{Authorization:`Bearer ${token}`}})
            setData(response.data)
        }catch(err){
            toast.error(err?.response?.data?.message || 'Something Went Wrong')
        }
    }
    const todo= data.filter((m=>m.status==='todo'))
    const in_progress=data.filter((m=>m.status==='in_progress'))
    const done=data.filter((m=>m.status==='done'))
  return (
    <div>
      
    </div>
  )
}

export default KanbanBoard
