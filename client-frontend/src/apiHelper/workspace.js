import api from "../../configs/api"

const addWorkspace = async (name) => {
    const token=localStorage.getItem("token")
   const response=  await api.post("/api/workspace",{name},{headers : {Authorization: `Bearer ${token}`}})
   return response.data
}

const getWorkspaces =async()=>{
    const token=localStorage.getItem("token")
    const response=await api.get('/api/workspaces',{headers : {Authorization: `Bearer ${token}`}})
    return response.data
}

const getSingleWorkspace=async(id)=>{
    const token=localStorage.getItem("token")
     const response=await api.get('/api/workspace/'+id,{headers : {Authorization: `Bearer ${token}`}})
     return response.data
}

export  {addWorkspace,getWorkspaces,getSingleWorkspace}
