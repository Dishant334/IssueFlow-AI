import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../configs/api.js'
import Loading from '../components/Loading.jsx'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Error from '../components/Invitation/Error.jsx'

const InvitePage = () => {
    const navigate=useNavigate()
    const loginnavigation=()=>{
        navigate(`/login?redirect=/invite/${token}`)
    }
    const authentoken=localStorage.getItem('token')
    const workspacenavigate=async()=>{
         try {
      await api.post(`/api/invite/accept/${token}`,{},{headers:{Authorization:`Bearer ${authentoken}`}})
      toast.success("Joined workspace successfully")
      navigate(`/workspace/${inviteData.workspaceId}`)
   } catch (err) {
      toast.error(err.response.data?.message)
   }
    }
    const {token}= useParams()
    const [inviteData,setInviteData]=useState(null)
    const [loading,setLoading]=useState(true)
    const [authtoken,setAuthtoken]=useState()
    const [error,setError]=useState(false)
    const validateToken=async ()=>{
        try{
        const response= await api.get(`/api/invite/${token}`)
       

        setInviteData(response.data)
         if (response.data.message === "Already Accepted") {
            toast.success("Already Accepted")
            navigate(`/workspace/${response.data.workspaceId}`)
            return
           }
         else if(!response.data.valid){
            setError(true)
         }
         
         setLoading(false)
        }catch(err){
           toast.error(err.response.data?.message || "Something went wrong")
           setLoading(false)
           setError(true)
        }
    }
   useEffect(() => {
  setAuthtoken(localStorage.getItem('token'))
}, [])

useEffect(() => {
  validateToken()
}, [token])

 if (loading) return <Loading />
if (error) return <Error title={inviteData?.message || "Invalid Invitation"} message='This link is no longer valid'/>

return (
  <div className='min-h-screen items-center flex bg-linear-to-tr from-gray-500 to-gray-800'>
    <div className='mx-auto border-4 p-8 rounded-2xl flex flex-col items-center gap-2'>
        <p className='text-3xl my-4'>You're invited to join : {inviteData.workspaceName}</p>
        <div className='flex text-lg my-4'>
         <p> Invited email : </p><p className='underline'>{inviteData.inviteemail}</p>
        </div>

        <div>
        {!authtoken? <button className='bg-linear-to-tr from-amber-600 to-amber-900 px-3 py-1 rounded-lg cursor-pointer' onClick={()=>loginnavigation()}>Login to accept</button> : <button className='bg-linear-to-tr from-green-600 to-green-900 px-3 py-1 rounded-lg cursor-pointer' onClick={()=>workspacenavigate()}>Accept Invitation </button>}
        </div>
    </div>
  </div>
)}

export default InvitePage
