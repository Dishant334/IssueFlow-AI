import React, { useEffect, useState } from 'react'
import api from '../../../configs/api'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import InviteForm from '../Invitation/InviteForm'

const DashboardMembers = () => {
  const {workspaceid}=useParams()
  const token=localStorage.getItem("token")
  const [admin,setAdmin]=useState(false)
  const [members,setMembers]=useState([])
  const [showInviteForm,setShowInviteForm]=useState(false)
  const [invites,setInvite]=useState([]) 
  const [refresh,setRefresh]=useState(false)


  useEffect(() => {
  if (showInviteForm) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = "auto"
  }
}, [showInviteForm])

  const promoteMember=async({memberId})=>{
    try{
        const confirmed = window.confirm("Are you sure you want to promote this member?")
        if(!confirmed) return;
      toast.success('Member Promoted to Admin')
      await api.patch(`/api/workspace/${workspaceid}/member/${memberId}/promote`,{},{headers:{Authorization:`Bearer ${token}`}})
      await membersData()
    }catch(err){
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }
  
  const deleteMember=async({memberId})=>{
   try{
     const confirmed = window.confirm("Are you sure you want to delete this member?")
      if(!confirmed) return;
    await api.delete(`/api/workspace/${workspaceid}/member/${memberId}`,{headers:{Authorization:`Bearer ${token}`}})
   
      toast.success('Member Removed Sucessfully')
    await membersData()
   }catch(err){
    toast.error(err.response.data?.message || 'Something went wrong')
   }
  }

  const removeInvite=async({inviteId})=>{
    try{
      const confirmed = window.confirm("Are you sure you want to delete this invite?")
      if(!confirmed) return;
      await api.delete(`api/workspace/${workspaceid}/invite/${inviteId}`,{headers:{Authorization:`Bearer ${token}`}})
      setRefresh(r=>!r)
    }catch(err){
      toast.error(err.response.data?.message)
    }
  }

   const membersData=async()=>{
    try{
     const response=await api.get(`/api/workspace/${workspaceid}/members`,{headers:{Authorization:`Bearer ${token}`}})
     setMembers(response.data.members) 
     if(response.data.currentUserRole == 'admin'){
        setAdmin(true)
     }
    }catch(err){
      toast.error(err.message?.response)
    }
   }

   const pendingInvites=async()=>{
    try{
      const response=await api.get(`/api/workspace/${workspaceid}/invites`,{headers:{Authorization:`Bearer ${token}`}})
      setInvite(response.data.invites)
    }catch(err){
      toast.error(err.message?.response)
    }
   }
   
   useEffect(() => {
  membersData()
  if (admin) pendingInvites()
}, [workspaceid, admin, refresh])
  
  return (
    <div   className='relative flex flex-col gap-6 items-center'>
      <p className='text-4xl text-gray-400'>Workspace Members</p>

      {admin && <button onClick={()=>setShowInviteForm(true)} className='bg-linear-to-r p-2 from-purple-400 to-purple-700 cursor-pointer rounded-2xl'>Invite New Members</button> }
      
 <p className="text-2xl font-semibold mb-4">Members</p>

<div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm  md:table-fixed  bg-white">
  <table className="min-w-full border-collapse">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Name
        </th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Email
        </th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Role
        </th>
        {admin && 
          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Remove Member
        </th>}
        {admin && 
          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Promote Member
        </th>}
      
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      {members.map(m => (
        <tr
          key={m.userId}
          className="hover:bg-gray-50 transition-colors"
        >
          <td className="px-6 py-4 text-sm font-medium text-gray-900">
            {m.name}
          </td>

          <td className="px-6 py-4 text-sm text-gray-600">
            {m.email}
          </td>
           {admin ? <td className="px-6 py-4 text-sm">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {m.role}
            </span>
          </td> : <td className="px-6 py-4 text-sm">
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              {m.role}
            </span>
          </td>}
          
        {admin &&
          <td className="px-6 py-4 text-center">
            <button onClick={()=>deleteMember({memberId:m.userId})} disabled={m.role == "admin"} className= {`text-sm font-medium ${m.role === "admin" ? "text-gray-400 cursor-not-allowed": " text-sm font-medium text-red-600 hover:text-red-700 hover:underline"}`}>
              Remove
            </button>
          </td>
         }
            {admin && 
          <td className="px-6 py-4 text-center">
            <button disabled={m.role == "admin"} onClick={()=>promoteMember({memberId:m.userId})} className={`text-sm font-medium ${m.role === "admin" ? "text-gray-400 cursor-not-allowed": "text-green-600 hover:text-green-700 hover:underline"}`}>
              Promote
            </button>
          </td>
         }
        </tr>
      ))}
    </tbody>
  </table>
</div>
{(admin && invites.length > 0)&&(
  <div>
<p className="text-2xl font-semibold mb-4 text-center">Invites</p>

<div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm  md:table-fixed  bg-white">
  <table className="min-w-full border-collapse">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Email
        </th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Invited By
        </th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Status
        </th>
        
          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Expires At
        </th>

          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Remove Invite
        </th>

        
        
       
      
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      {invites.map(m => (
        <tr
          key={m._id}
          className="hover:bg-gray-50 transition-colors"
        >
          <td className="px-6 py-4 text-sm font-medium text-gray-900">
            {m.email}
          </td>

          <td className="px-6 py-4 text-sm text-gray-600">
            {m.invitedBy.name}
          </td>

           <td className="px-6 py-4 text-sm">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {m.status}
            </span>
          </td> 
          <td className="px-6 py-4 text-sm text-gray-600">
            {new Date(m.expiresAt).toLocaleDateString()}
          </td>
           <td className="px-6 py-4 text-center">
            <button  onClick={()=>removeInvite({inviteId:m._id})} className={`cursor-pointer text-sm font-medium ${ "text-red-600 hover:text-red-700 hover:underline"}`}>
              Remove
            </button>
          </td>
        
          
         
        </tr>
      ))}
    </tbody>
  </table>
</div> 
</div>)
}

{ showInviteForm && <InviteForm setShowInviteForm={setShowInviteForm} setRefresh={setRefresh}/> }
    
    </div>
  )
}

export default DashboardMembers
