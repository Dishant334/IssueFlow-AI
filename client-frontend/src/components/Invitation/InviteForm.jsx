import React from 'react'
import { useState } from 'react'
import api from '../../../configs/api'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const InviteForm = ({setShowInviteForm,setRefresh}) => {
    const [formData,setFormData]=useState('')
    const {workspaceid}=useParams()
    const token=localStorage.getItem('token')
    const onclose=()=>{
        setShowInviteForm(false)
    }
    const handleSubmit=async(e)=>{
         e.preventDefault()
        try{
            await api.post(`/api/workspace/${workspaceid}/invite`,{email:formData},{headers:{Authorization:`Bearer ${token}`}})
            toast.success('Invite Sent Successfully')
            setFormData('')
            setRefresh(r=>!r)
            onclose()
        }catch(err){
            toast.error(err.response.data?.message || 'Something went wrong')
        }
       
        
    }
    const handleInput=(e)=>{
      setFormData(e.target.value)
    }
  return (
     <div className="absolute inset-0 z-40 grid place-items-center " onClick={(e)=>e.stopPropagation()} >
    
    {/* Overlay */}
    <div className="absolute inset-0 min-h-screen bg-black/40 backdrop-blur-sm "  onClick={onclose}  />

    {/* Modal box */}
  <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
  
  {/* Header */}
  <div className="mb-6 text-center">
    <h2 className="text-xl font-semibold text-gray-900">
      Invite a team member
    </h2>
    <p className="mt-1 text-sm text-gray-500">
      Enter their email address to send an invite
    </p>
  </div>

  {/* Form */}
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    
    {/* Input */}
    <div className="flex flex-col gap-1">
      <label
        htmlFor="email"
        className="text-sm font-medium text-gray-700"
      >
        Email address
      </label>

      <input
        id="email"
        type="email"
        name="email"
        value={formData}
        onChange={handleInput}
        placeholder="name@company.com"
        className="
          rounded-xl border border-gray-300 px-4 py-2
          text-sm text-gray-900
          placeholder:text-gray-400
          focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
          outline-none transition
        "
        required
      />
    </div>

    {/* Actions */}
    <div className="mt-4 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onclose}
        className="
          rounded-xl px-4 py-2 text-sm font-medium
          text-gray-600 hover:bg-gray-100 transition
        "
      >
        Cancel
      </button>

      <button
        type="submit"
        className="
          rounded-xl bg-linear-to-tr from-purple-500 to-purple-700
          px-5 py-2 text-sm font-medium text-white
          shadow-md hover:shadow-lg
          hover:brightness-110 transition
        "
      >
        Send Invite
      </button>
    </div>
  </form>
</div>

  </div>
  )
}

export default InviteForm
