import axios from 'axios'

const api= axios.create({
    baseURL:import.meta.env.VITE_BASE_URL
})

// every request carries the newest token. Components read the token once when they open, so after a refresh
// they would still send the old one and each request would need a retry
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token")
    if(token) config.headers.Authorization=`Bearer ${token}`
    return config
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
