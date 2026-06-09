import React, { useEffect, useState } from "react";
import api from "../../../configs/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const EditTaskForm = ({ onClose, fetchTasks, taskId }) => {
  const { workspaceid, projectId } = useParams();
  const token = localStorage.getItem("token");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignedTo: "",
  });

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.patch(
        `/api/workspace/${workspaceid}/projects/${projectId}/tasks/${taskId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response?.data?.message || "Task Updated");
      onClose();
      await fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(
          `/api/workspace/${workspaceid}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMembers(response.data.members);
      } catch (err) {
        toast.error("Failed to load members");
      }
    }

    fetchData();
  }, [workspaceid]);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl mx-4 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
        >
          {/* Header */}
          <h2 className="text-xl font-semibold text-white">
            Edit Task
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Update task details and assignments
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title */}
            <div>
              <label className="text-sm text-slate-300 block mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleInput}
                placeholder="Enter task title"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-slate-300 block mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={data.description}
                onChange={handleInput}
                placeholder="Enter description"
                rows={3}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Priority (modern pills instead of radio) */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">
                Priority
              </label>
              <div className="flex gap-3">
                {["low", "medium", "high"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setData({ ...data, priority: item })}
                    className={`px-3 py-1.5 rounded-lg text-sm transition
                      ${
                        data.priority === item
                          ? item === "high"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : item === "medium"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                            : "bg-green-500/20 text-green-400 border border-green-500/40"
                          : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="text-sm text-slate-300 block mb-1">
                Assign To
              </label>
              <select
                name="assignedTo"
                value={data.assignedTo}
                onChange={handleInput}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                )}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditTaskForm;