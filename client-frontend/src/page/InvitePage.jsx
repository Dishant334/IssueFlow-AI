import React from 'react'
import { useParams } from 'react-router-dom'
import {loading} from '../loading/loading.jsx'

const InvitePage = () => {
    const {token}= useParams()

  return (
    <div>
    <loading/>  
    </div>
  )
}

export default InvitePage
