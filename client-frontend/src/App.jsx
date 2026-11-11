import { lazy, Suspense } from 'react'
import Home from './page/Home.jsx'
import Loading from './components/Loading.jsx'
import { Routes,Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './App.css'
const Login = lazy(() => import('./page/Login.jsx'))
const Register = lazy(() => import('./page/Register.jsx'))
const Dashboar = lazy(() => import('./page/Dashboar.jsx'))
const DashboardHome = lazy(() => import('./components/Dashboard/DashboardHome.jsx'))
const DashboardAllProject = lazy(() => import('./components/Dashboard/DashboardAllProject.jsx'))
const DashboardMembers = lazy(() => import('./components/Dashboard/DashboardMembers.jsx'))
const DashboardMyTasks = lazy(() => import('./components/Dashboard/DashboardMyTasks.jsx'))
import ProtectedRoute from './protectFrontend/ProtectedRoute.jsx'
const CreateWorkspace = lazy(() => import('./components/CreateWorkspace/CreateWorkspace.jsx'))
const DashboardSettings = lazy(() => import('./components/Dashboard/DashboardSettings.jsx'))
const InvitePage = lazy(() => import('./page/InvitePage.jsx'))
const SingleProject = lazy(() => import('./components/Dashboard/SingleProject.jsx'))
const Overview = lazy(() => import('./components/SingleProject.jsx/Overview.jsx'))
const Setting = lazy(() => import('./components/SingleProject.jsx/Setting.jsx'))
const Members = lazy(() => import('./components/SingleProject.jsx/Members.jsx'))
const Tasks = lazy(() => import('./components/SingleProject.jsx/Tasks.jsx'))
import { Navigate } from 'react-router-dom'
function App() {
  return (
    <>
           <Toaster position="top-center" reverseOrder={false} />
    <Suspense fallback={<Loading/>}>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
     <Route path='/register' element={<Register/>}/>
     {/*Protected Route*/}
     <Route element={<ProtectedRoute/>}>
     <Route path='/createWorkspace' element={<CreateWorkspace/>}/>    
     <Route path='/workspace/:workspaceid' element={<Dashboar/>}>
       <Route index element={<Navigate to='home' replace/>}/>
       <Route path='home' element={<DashboardHome/>} />
       <Route path='tasks' element={<DashboardMyTasks/>}/>
       <Route path="projects">

  <Route index element={<DashboardAllProject />}/>

  <Route path=":projectId" element={<SingleProject />}>
    <Route index element={<Navigate to="projecto" replace />} />
   <Route path="projecto" element={<Overview />} />
    <Route  path="projectt" element={<Tasks />} />
    <Route path="projectm" element={<Members />}/>
    <Route path="projectsset" element={<Setting />}/></Route>
</Route>
       <Route path='members' element={<DashboardMembers/>}/>
       <Route path='settings' element={<DashboardSettings/>}/>
     </Route>
     </Route>
     <Route path='/invite/:token' element={<InvitePage/>}/>
    </Routes>
    </Suspense>
    </>
  )
}

export default App
