import React, { useState, useEffect, Suspense } from 'react'
import toast from 'react-hot-toast'
import api from '../../../configs/api'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import NavButtons from '../SingleProject.jsx/NavButtons'

const SingleProject = () => {
  const [singleProject, setSingleProject] = useState({})
  const [permissions, setPermissions] = useState({})
  const [loading, setLoading] = useState(true)

  const { projectId, workspaceid } = useParams()
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  const SingleProjectData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSingleProject(response.data)

      const currentUserRole = response.data.currentUserRole
      const isWorkspaceAdmin = currentUserRole.workspaceRole === "admin"
      const isProjectAdmin = currentUserRole.projectRole === "project_admin"
      const isArchived = response.data.projectStatus === "archived"

      setPermissions({
        isWorkspaceAdmin,
        isProjectAdmin,
        isArchived,
        canManageMembers: !isArchived && (isWorkspaceAdmin || isProjectAdmin),
        canEditProject: !isArchived && (isWorkspaceAdmin || isProjectAdmin),
        canArchiveProject: !isArchived && (isWorkspaceAdmin || isProjectAdmin),
        canActivateProject: isArchived && (isWorkspaceAdmin || isProjectAdmin),
        canDeleteProject: isArchived && isWorkspaceAdmin,
      })

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const statuses = async (status) => {
    const confirm = window.confirm("Are You Sure To change the status of project ??")
    if (!confirm) return
    try {
      await api.patch(`/api/projects/${projectId}/archive`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate(`/workspace/${workspaceid}/projects`)
      toast.success(`Project ${status} successful`)
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong")
    }
  }

  useEffect(() => {
    SingleProjectData()
  }, [projectId])

  return (
    <div>

      {/* Project Header */}
      <div className="bg-slate-900 rounded-xl border-b border-slate-700 px-12 py-4 flex justify-between items-start shadow-md">

        {loading ? (
          <>
            {/* LEFT SKELETON */}
            <div className="space-y-3 w-full animate-pulse">
              <div className="h-6 w-48 bg-slate-700 rounded"></div>
              <div className="h-4 w-96 bg-slate-700 rounded"></div>
              <div className="h-5 w-20 bg-slate-700 rounded-full"></div>
            </div>

            {/* RIGHT SKELETON */}
            <div className="h-10 w-28 bg-slate-700 rounded-lg animate-pulse"></div>
          </>
        ) : (
          <>
            {/* LEFT SIDE */}
            <div className="space-y-2">
              <p className="text-3xl font-semibold text-slate-100">
                {singleProject.projectName}
              </p>

              <p className="text-sm text-slate-100 max-w-xl">
                {singleProject.projectDescription}
              </p>

              <span
                className={
                  singleProject.projectStatus === "active"
                    ? "inline-block text-xs font-medium px-3 py-1 rounded-full bg-green-500/20 text-green-400"
                    : "inline-block text-xs font-medium px-3 py-1 rounded-full bg-gray-400 text-gray-600/20"
                }
              >
                {singleProject.projectStatus}
              </span>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center">
              {singleProject.projectStatus === "active" ? (
                <button
                  onClick={() => statuses('archived')}
                  className="bg-slate-800 hover:bg-gray-400 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-sm"
                >
                  Archive
                </button>
              ) : (
                <button
                  onClick={() => statuses('active')}
                  className="bg-slate-800 hover:bg-green-500 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-sm"
                >
                  Activate
                </button>
              )}
            </div>
          </>
        )}

      </div>

      {/* Navbar */}
      <NavButtons loading={loading} />

      {/* Child Routes */}
      <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500"></div></div>}>
        <Outlet context={{ singleProject, permissions,loading }} />
      </Suspense>

    </div>
  )
}

export default SingleProject