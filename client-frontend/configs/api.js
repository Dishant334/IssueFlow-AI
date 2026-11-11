import axios from 'axios'

const api= axios.create({
    baseURL:import.meta.env.VITE_BASE_URL
})

// if the short lived token expired, get a new one with the refresh token and retry the request once
api.interceptors.response.use(
    (response)=>response,
    async (error)=>{
        const original=error.config
        const refreshToken=localStorage.getItem("refreshToken")

        if(error.response?.status===401 && error.response?.data?.message==="Unauthorized" && refreshToken && !original._retry){
            original._retry=true
            try{
                const res=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/refresh`,{refreshToken})
                localStorage.setItem("token",res.data.token)
                original.headers.Authorization=`Bearer ${res.data.token}`
                return api(original)
            }catch{
                //refresh token also expired or removed, login again
                localStorage.removeItem("token")
                localStorage.removeItem("refreshToken")
                window.location.href='/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
