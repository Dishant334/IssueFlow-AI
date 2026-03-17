import React, { useEffect, useState } from 'react'
import api from '../../../configs/api'
import { useParams } from 'react-router-dom'
import {toast} from 'react-hot-toast'

const AddMemberModal = ({setIsAddMember,projectMembers}) => {
     const [newMembers,setNewMembers]=useState([])
     const [allMembers,setAllMembers]=useState([])
     const {workspaceid}=useParams()
     const token=localStorage.getItem('token')
     const {projectId}=useParams()

     const handleSubmit = (e) => {
      e.preventDefault()
      addMember()
      setIsAddMember(false)
     }   


     const handleCheckbox = (e, id) => {
      if (e.target.checked) {
      setNewMembers(prev => [...prev, id])
     } else {
      setNewMembers(prev => prev.filter(member => member !== id))
    }
    }

    const addMember=async()=>{
     try{
        const response= await api.post(`/api/projects/${projectId}/members`,newMembers,{headers:{Authorization:`Bearer ${token}`}})
        toast.success(response?.data?.message || "Members added successfully")
     }catch(err){
        toast.error(err.response?.data?.message || "Something went wrong")
     }   
    }
  
     const allmember=async()=>{
        try{
        const response=await api.get(`/api/workspace/${workspaceid}/members`,{headers:{Authorization:`Bearer ${token}`}}) 
        setAllMembers(response.data.members)
        }catch(err){
        toast.error(err.response?.data?.message|| "Something Went Wrong")
        }
     }
    const availableMembers=allMembers.filter(user=>
        !projectMembers.some(member=>member.userId ===user.userId)
     )

     useEffect(()=>
        {allmember()},[])
  return (
    <div>
        {/* Backdrop */}
    <div onClick={()=>setIsAddMember(false)} className='absolute inset-0 z-40 backdrop-blur-md'></div>
        {/*Modal*/}
    <div onClick={(e)=>e.stopPropagation()} className='absolute top-1/2 left-1/2 bg-white p-4 -translate-x-1/2 -translate-y-1/2 rounded-lg z-50'>
        {availableMembers.length > 0?
        <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold">Add Members</h2>
            { availableMembers.map((member)=>{
                    return (
                    <label key={member.userId} className='flex gap-2'>
                    <input type="checkbox" onChange={(e)=>handleCheckbox(e,member.userId)}/>{member.name}
                    </label>
                    )
                })
            }
            <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded'>Add Members</button>
        </form>:<div className='text-sm font-serif'>No members to add</div>
        }
    </div>
    </div>
  )
}

export default AddMemberModal
