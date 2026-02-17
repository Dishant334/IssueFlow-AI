import React, { useEffect, useState } from 'react'
import api from '../../../configs/api'
import { useParams } from 'react-router-dom'

const DashboardMembers = () => {
  const {workspaceid}=useParams()
  const token=localStorage.getItem("token")
  const [admin,setAdmin]=useState(false)
  const [members,setMembers]=useState(null)

   const membersData=()=>{
    try{
     const response=api.get(`/api/workspace/${workspaceid}/members`,{headers:{Authorization:`Bearer ${token}`}})
     setMembers(response.data)
    }catch(err){
      toast.error(err.message?.response)
    }
   }
  useEffect(()=>membersData(),[members]) 
  return (
    <div className='flex items-center'>
      
    
    </div>
  )
}

export default DashboardMembers
