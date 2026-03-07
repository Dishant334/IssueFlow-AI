import React from 'react'

const Setting = () => {
  return (
     <div className='p-6'>
      <div className="flex justify-between items-center mb-4">
    <p className='text-2xl font-semibold'>Project Settings</p>  
      </div>

  <p className="text-xl font-semibold text-gray-800 mx-4">
    Edit Project Details
  </p>

  <hr className="border-t border-gray-200 my-2 mx-4" />
     <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6">
  <form className="flex flex-col gap-4">

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">
        Project Name
      </label>
      <input
        type="text"
        name="name"
        placeholder="Enter project name"
        className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">
        Project Description
      </label>
      <textarea
        name="desc"
        placeholder="Project description"
        rows="4"
        className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none"
      ></textarea>
    </div>

    <button
      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
    >
      Change
    </button>

  </form>
</div>
    <hr className='my-8'/>

<div className='text-red-700 text-xl mx-4'>Danger Zone</div>
<hr className="border-t border-gray-200 my-2 mx-4" />
    <div className='flex justify-evenly my-4'>
      <button className='px-4 py-1 bg-gray-600 rounded-xl text-gray-400 cursor-pointer'>Archive</button>
      <button className='px-4 py-1 bg-red-600 rounded-xl text-red-800 cursor-pointer'>Delete</button>
      </div>
    </div>
  )
}

export default Setting
