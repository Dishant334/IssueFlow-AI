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
import CreateWorkspace from './components/CreateWorkspace/CreateWorkspace.jsx'
import DashboardSettings from './components/Dashboard/DashboardSettings.jsx'
import InvitePage from './page/InvitePage.jsx'
import SingleProject from './components/Dashboard/SingleProject.jsx'
import Overview from './components/SingleProject.jsx/Overview.jsx'
import Setting from './components/SingleProject.jsx/Setting.jsx'
import Members from './components/SingleProject.jsx/Members.jsx'
import Tasks from './components/SingleProject.jsx/Tasks.jsx'

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
     <Route path='/createWorkspace' element={<CreateWorkspace/>}/>    
     <Route path='/workspace/:workspaceid' element={<Dashboar/>}>
       <Route default element={<DashboardHome/>}/>
       <Route path='home' element={<DashboardHome/>} />
       <Route path='tasks' element={<DashboardMyTasks/>}/>
       <Route path='projects' element={<DashboardAllProject/>}>
          <Route path=':projectId' element={<SingleProject/>}>
              <Route index element={<Overview/>}/>
              <Route path='projecto' element={<Overview/>}/>
              <Route path='projectt' element={<Tasks/>}/>
              <Route path='projectm' element={<Members/>}/>
              <Route path='projects' element={<Setting/>}/>
            </Route>
       </Route>
       <Route path='members' element={<DashboardMembers/>}/>
       <Route path='settings' element={<DashboardSettings/>}/>
     </Route>
     </Route>
     <Route path='/invite/:token' element={<InvitePage/>}/>
    </Routes>
    </>
  )
}

export default App
