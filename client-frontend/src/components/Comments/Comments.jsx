import React, { useEffect, useState } from 'react'
import api from '../../../configs/api'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import socket from '../../socket.js'

const Comments = ({ taskId }) => {
const [page, setPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)
  const [comments, setComments] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")

  const { workspaceid, projectId } = useParams()
  const token = localStorage.getItem('token')

  const fetchData = async () => {
    try {
    const res = await api.get(
  `/api/workspace/${workspaceid}/project/${projectId}/task/${taskId}/comments?page=${page}&limit=3`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
)


      setTotalPages(res.data.totalPages)
      setComments(res.data.comments)
    } catch (err) {
      console.error(err)
    }
  }

  //  DELETE
  const handleDelete = async (commentId) => {
    try {
      await api.delete(
        `/api/workspace/${workspaceid}/project/${projectId}/task/${taskId}/comments/${commentId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      fetchData()
    } catch {
      toast.error("Delete failed")
    }
  }

  //  EDIT START
  const startEdit = (comment) => {
    setEditingId(comment._id)
    setEditText(comment.text)
  }

  // SAVE EDIT
  const handleEditSave = async (commentId) => {
    try {
      await api.patch(
        `/api/workspace/${workspaceid}/project/${projectId}/task/${taskId}/comments/${commentId}/edit`,
        { editedComment: editText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setEditingId(null)
      fetchData()
    } catch {
      toast.error("Edit failed")
    }
  }

  useEffect(() => {
    if (workspaceid && projectId && taskId) {
      fetchData()
    }
  }, [workspaceid, projectId, taskId,page])


  useEffect(() => {
  if (!taskId) return;

  // the server forgets the rooms when the connection drops, so join again after every (re)connect
  const join = () => socket.emit("joinTask", taskId);
  socket.on("connect", join);
  if (socket.connected) join();
  else socket.connect();

  return () => {
    socket.off("connect", join);
    socket.emit("leaveTask", taskId);
  };
}, [taskId]);

useEffect(() => {
  const onNewComment = (newComment) => {
    if (page === 1) {
      setComments((prev) => [newComment, ...prev]);
    }
  };
  socket.on("newComment", onNewComment);

  return () => socket.off("newComment", onNewComment);
}, [page]);

useEffect(() => {
  const onEditComment = ({ commentId, text }) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? { ...c, text, isEdited: true }
          : c
      )
    );
  };
  socket.on("editComment", onEditComment);

  return () => socket.off("editComment", onEditComment);
}, []);

useEffect(() => {
  const onDeleteComment = (commentId) => {
    setComments((prev) =>
      prev.filter((c) => c._id !== commentId)
    );
  };
  socket.on("deleteComment", onDeleteComment);

  return () => socket.off("deleteComment", onDeleteComment);
}, []);

  return (
    <div className="mt-4 max-h-64  space-y-1 pr-1">
      {comments.length === 0 ? (
        <div className="text-sm text-gray-400 text-center">
          No comments yet
        </div>
      ) : (
        comments.map((m) => (
          <div
            key={m._id}
            className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg shadow-sm"
          >
            {/* Avatar */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-semibold">
              {m.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* Content */}
            <div className="flex flex-col w-full">
              
              {/* Name + Edited */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">
                  {m.user?.name || "Unknown"}
                </span>

                {m.isEdited && (
                  <span className="text-xs text-gray-400">
                    (edited)
                  </span>
                )}
              </div>

              {/* Text OR Edit Input */}
              {editingId === m._id ? (
                <div className="flex gap-2 mt-1">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border px-2 py-1 rounded text-sm w-full"
                  />
                  <button
                    onClick={() => handleEditSave(m._id)}
                    className="text-xs bg-green-500 text-white px-2 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-600">
                  {m.text}
                </span>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                <button
                  onClick={() => startEdit(m)}
                  className="hover:text-blue-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(m._id)}
                  className="hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      <div className="flex justify-between items-center mt-3 text-sm">
  
  <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
    className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Prev
  </button>

  <span className="text-gray-500">
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
    className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>

</div>
    </div>
  )
}

export default Comments