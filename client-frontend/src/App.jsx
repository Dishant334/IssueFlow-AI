import Home from './page/Home.jsx'
import { Routes,Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './App.css'
import Login from './page/Login.jsx'
import Register from './page/Register.jsx'
import Dashboar from './page/Dashboar.jsx'
import DashboardHome from './components/Dashboard/DashboardHome.jsx'
import DashboardAllProject from './components/Dashboard/DashboardAllProject.jsx'
import DashboardMembers from './components/Dashboard/DashboardMembers.jsx'
import DashboardMyTasks from './components/Dashboard/DashboardMyTasks.jsx'
import ProtectedRoute from './protectFrontend/ProtectedRoute.jsx'

function App() {


  return (
    <>
           <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
     <Route path='/register' element={<Register/>}/>

     {/*Protected Route*/}
     <Route element={<ProtectedRoute/>}>
     <Route path='/workspace/:workspaceid' element={<Dashboar/>}>
       <Route default element={<DashboardHome/>}/>
       <Route path='home' element={<DashboardHome/>} />
       <Route path='tasks' element={<DashboardMyTasks/>}/>
       <Route path='projects' element={<DashboardAllProject/>}/>
       <Route path='members' element={<DashboardMembers/>}/>
     </Route>
     </Route>    
    </Routes>
    </>
  )
}

export default App
