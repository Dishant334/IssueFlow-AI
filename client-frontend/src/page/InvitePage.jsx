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
    const workspacenavigate=async()=>{
         try {
      await api.post(`/invite/accept/${token}`)
      toast.success("Joined workspace successfully")
      navigate(`/workspace/${inviteData.workspaceId}`)
   } catch (err) {
      toast.error("Could not accept invitation")
   }
    }
    const {token}= useParams()
    const [inviteData,setInviteData]=useState(null)
    const [loading,setLoading]=useState(true)
    const [authtoken,setAuthtoken]=useState()
    const [error,setError]=useState(false)
    const validateToken=async ()=>{
        try{
        const response= await api.get(`/invite/${token}`)
       

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
           toast.error("Token is wrong")
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
  <div className='min-h-screen flex  items-center justify-center bg-linear-to-tr from-blue-400 to-blue-700'>
    <div className='mx-auto '>
        <p className='text-3xl'>You're invited to join : {inviteData.workspaceName}</p>
        <p>Invited email: {inviteData.inviteemail}</p>

        {!authtoken? <button onClick={()=>loginnavigation()}>Login to accept</button> : <button onClick={()=>workspacenavigate()}>Accept Invitation </button>}
    </div>
  </div>
)}

export default InvitePage
