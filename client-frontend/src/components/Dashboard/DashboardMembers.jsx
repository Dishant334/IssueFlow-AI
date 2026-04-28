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
  const [loading,setLoading]=useState(false)


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
      await api.delete(`/api/workspace/${workspaceid}/invite/${inviteId}`,{headers:{Authorization:`Bearer ${token}`}})
      setRefresh(r=>!r)
    }catch(err){
      toast.error(err.response.data?.message)
    }
  }

   const membersData=async()=>{
    setLoading(true)
    try{
     const response=await api.get(`/api/workspace/${workspaceid}/members`,{headers:{Authorization:`Bearer ${token}`}})
     setMembers(response.data.members) 
     if(response.data.currentUserRole == 'admin'){
        setAdmin(true)
     }
    }catch(err){
      toast.error(err.message?.response)
    }finally{
      setLoading(false)
    }
   }

   const pendingInvites=async()=>{
    setLoading(true)
    try{
      const response=await api.get(`/api/workspace/${workspaceid}/invites`,{headers:{Authorization:`Bearer ${token}`}})
      setInvite(response.data.invites)
    }catch(err){
      toast.error(err.message?.response)
    }finally{
    setLoading(false)
   }
   }
   
   useEffect(() => {
  membersData()
  if (admin) pendingInvites()
}, [workspaceid, admin, refresh])
     
   if(loading){
      return  <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
  <div className="w-10 h-10 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
</div>
   }
  return (
    <div   className='relative gap-6 items-center'>
       <div className='m-4  flex justify-between'>
        <div>
        <p className='font-semibold text-3xl text-slate-100'>Workspace Members</p>
        <p className='text-sm text-slate-400 mt-1 max-w-md'>Manage your teams and permissions</p>
          </div>
         {admin && <button onClick={()=>setShowInviteForm(true)} className='bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-2 hover:bg-blue-500/20 transition-all duration-200 cursor-pointer rounded-2xl mr-8'>Invite New Members</button> }
         
      </div>
      

     
      
<div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-xl p-5">

  {/* Header */}
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-white text-lg font-semibold">Members</h2>
    <span className="text-slate-400 text-sm">{members.length} members</span>
  </div>

  {/* List */}
  <div className="space-y-2">
    {members.map(m => (
      <div
        key={m.userId}
        className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-700/40 transition"
      >

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm font-semibold">
            {m.name[0]}
          </div>

          <div>
            <p className="text-white text-sm font-medium">{m.name}</p>
            <p className="text-slate-400 text-xs">{m.email}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Role */}
          <span className={`text-xs px-2 py-1 rounded-md ${
            m.role === "admin"
              ? "bg-purple-500/10 text-purple-400"
              : "bg-slate-600/30 text-slate-300"
          }`}>
            {m.role}
          </span>

          {/* Actions */}
          {admin && (
            <>
              <button
                disabled={m.role === "admin"}
                onClick={() => deleteMember({ memberId: m.userId })}
                className={`text-xs ${
                  m.role === "admin"
                    ? "text-slate-500 cursor-not-allowed"
                    : "text-red-400 hover:text-red-300"
                }`}
              >
                Remove
              </button>

              <button
                disabled={m.role === "admin"}
                onClick={() => promoteMember({ memberId: m.userId })}
                className={`text-xs ${
                  m.role === "admin"
                    ? "text-slate-500 cursor-not-allowed"
                    : "text-green-400 hover:text-green-300"
                }`}
              >
                Promote
              </button>
            </>
          )}

        </div>
      </div>
    ))}
  </div>
</div>


{(admin && invites.length > 0)&&(
  <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-xl p-5 mt-6">

  {/* Header */}
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-white text-lg font-semibold">Invites</h2>
    <span className="text-slate-400 text-sm">{invites.length} pending</span>
  </div>

  {/* List */}
  <div className="space-y-2">
    {invites.map(m => (
      <div
        key={m._id}
        className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-700/40 transition"
      >

        {/* LEFT */}
        <div>
          <p className="text-white text-sm font-medium">{m.email}</p>
          <p className="text-slate-400 text-xs">
            Invited by {m.invitedBy.name}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Status */}
          <span className="text-xs px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400">
            {m.status}
          </span>

          {/* Expiry */}
          <span className="text-xs text-slate-400">
            {new Date(m.expiresAt).toLocaleDateString()}
          </span>

          {/* Remove */}
          <button
            onClick={() => removeInvite({ inviteId: m._id })}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Remove
          </button>

        </div>
      </div>
    ))}
  </div>

</div>)
}

{ showInviteForm && <InviteForm setShowInviteForm={setShowInviteForm} setRefresh={setRefresh}/> }
    
    </div>
  )
}

export default DashboardMembers
