import React from 'react'
import {ArrowRight, CircleCheckBig, FileUser, FolderOpen, User} from 'lucide-react'

const DashboardHome = () => {
  return (
    <div>
      <div className='m-4'>
        <p className='font-semibold text-lg'>Home</p>
        <p className='text-sm'>Monitor all of your projects and tasks here</p>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-2 lg:flex lg:justify-evenly mt-12 gap-6'>
        <div className='border border-gray-400 p-4 gap-12 rounded-sm flex justify-between  min-w-56'>
          <div>
          <p className='text-sm text-gray-500'>Total Projects</p>
          <p className='text-2xl font-semibold'>1</p>
          </div>
           <FolderOpen className='bg-blue-300 text-blue-600 rounded-md p-0.5' size={30}/>
        </div>
          <div className='border border-gray-400 p-4 gap-12 rounded-sm flex  justify-between min-w-56'>
          <div>
          <p className='text-sm text-gray-500'>Total Tasks</p>
          <p className='text-2xl font-semibold'>1</p>
          </div>
           <User className='bg-purple-300 text-purple-600 rounded-md p-0.5' size={30}/>
        </div>
          <div className='border border-gray-400 p-4 gap-12 rounded-sm flex justify-between  min-w-56'>
          <div>
          <p className='text-sm text-gray-500'>Assigned Tasks</p>
          <p className='text-2xl font-semibold'>1</p>
          </div>
           <FileUser className='bg-yellow-300 text-yellow-600 rounded-md p-0.5' size={30}/>
        </div>
          <div className='border border-gray-400 p-4 gap-12 rounded-sm flex justify-between  min-w-56'>
          <div>
          <p className='text-sm text-gray-500'>Completed Tasks</p>
          <p className='text-2xl font-semibold'>1</p>
          </div>
             <CircleCheckBig className='bg-green-300 text-green-600 rounded-md p-0.5' size={30}/>
        </div>
      </div>
        
      <div className='w-full flex mt-8 gap-4 '>
        <div className=' w-4/6  px-4 border   border-gray-200'>
          <div className='flex justify-between'>
            <p className='text-sm text-gray-400'>Recent Projects</p>
            <div className='flex cursor-pointer transform hover:scale-125'>
            <button className='text-sm text-gray-400'>View All</button>
            <ArrowRight   size={16} className='mt-1 text-gray-400'/>
          </div>
          </div>
          <hr className="border-gray-200 my-4" />
          <div className='mx-4'>
            Projects
          </div>
        </div>
        <div className=' w-2/6  px-4 border border-gray-200'>
        <div className='flex justify-between mx-2'>
            <p className='text-gray-400 text-sm'>My Recent Tasks</p>
             <div className='flex cursor-pointer transform hover:scale-125'>
            <button className='text-sm text-gray-400'>View All</button>
            <ArrowRight   size={16} className='mt-1 text-gray-400'/>
          </div>
          </div>
          <hr className="border-gray-200 my-4" />
          <div className='mx-4'>
            Tasks
          </div>
        </div>
        
          
      </div>

    </div>
  )
}

export default DashboardHome
