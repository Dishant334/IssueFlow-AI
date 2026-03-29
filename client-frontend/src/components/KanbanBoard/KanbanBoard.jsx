import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../../configs/api'
import {useParams} from 'react-router-dom'
    import { useEffect } from 'react';

const KanbanBoard = () => {
    const [data,setData]=useState([])
    const token=window.localStorage.getItem('token')
    const {workspaceid,projectId}=useParams()
    
    const fetchTasks=async()=>{
        try{
            const response=await api.get(`/api/workspace/${workspaceid}/projects/${projectId}/tasks`,{headers:{Authorization:`Bearer ${token}`}})
            setData(response.data.tasks)
        }catch(err){
            toast.error(err?.response?.data?.message || 'Something Went Wrong')
        }
    }
    const todo= data?.filter((m=>m.status==='todo'))
    const in_progress=data?.filter((m=>m.status==='in_progress'))
    const done=data?.filter((m=>m.status==='done'))



        useEffect(() => {
           fetchTasks();
         }, [projectId,workspaceid]);
  return (
    <div>
      hi
    </div>
  )
}

export default KanbanBoard
