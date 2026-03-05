import { useState } from 'react'
import { useParams } from "react-router-dom";
import api from '../../../configs/api'
import toast from 'react-hot-toast'

const CreateProject = ({onclose,setRefresh}) => {
  const [data,setData]=useState({
    projectName:"",
    projectDescription:""
  })
  const {workspaceid}=useParams()
  const handleSubmit=async (e)=>{
    const token=localStorage.getItem("token")
    e.preventDefault()
    try{
        await api.post(`/api/workspace/${workspaceid}/projects`,{projectName: data.projectName,projectDesc: data.projectDescription},{headers:{Authorization:`Bearer ${token}`}})
        toast.success('Created New Project Successfully')
        setData({projectName:"",projectDescription:""})
        setRefresh(p=>!p)
        onclose()
    }catch(err){
        toast.error(err.response?.data?.message || "Something went wrong")
    }
  }
  const handleInput=(e)=>{
    setData(prev=>({...prev, [e.target.name] : e.target.value}))
  }

  return (
           <div className="absolute inset-0 z-40 grid place-items-center " onClick={(e)=>e.stopPropagation()} >
    
    {/* Overlay */}
    <div className="absolute inset-0 min-h-screen  bg-black/40 backdrop-blur-sm " onClick={onclose}  />

    {/* Modal box */}
  <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
  
  {/* Header */}
  <div className="mb-6 text-center">
    <h2 className="text-xl font-semibold text-gray-900">
      Create A New Project
    </h2>
    <p className="mt-1 text-sm text-gray-500">
      Enter their project name and description
    </p>
  </div>

  {/* Form */}
  <form onSubmit={handleSubmit}  className="flex flex-col gap-4">
    
    {/* Input */}
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="projectName"
        className="text-sm font-medium text-gray-700"
      >
        Project Name
      </label>

      <input
        id="projectName"
        type="text"
        name="projectName"
        value={data.projectName}
        onChange={handleInput}
        placeholder="Enter project name"
        className="
          rounded-xl border border-gray-300 px-4 py-2
          text-sm text-gray-900
          placeholder:text-gray-400
          focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
          outline-none transition
        "
        required
      />
         <label
        htmlFor="projectDescription"
        className="text-sm font-medium text-gray-700"
      >
        Project Description
      </label>

      <textarea
        id="projectDescription"
        type="text"
        name="projectDescription"
        value={data.projectDescription}
        onChange={handleInput}
        placeholder="Enter project description"
        className="
          rounded-xl border border-gray-300 px-4 py-2
          text-sm text-gray-900
          placeholder:text-gray-400
          focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
          outline-none transition
        "
      />
    </div>

    {/* Actions */}
    <div className="mt-4 flex items-center justify-end gap-3">
      <button
      onClick={onclose}
        type="button"
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
       Create Project
      </button>
    </div>
  </form>
</div>

  </div>
  )
}

export default CreateProject
