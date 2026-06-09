import React, { useEffect, useState } from "react";
import api from "../../../configs/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const AddTaskForm = ({ onClose, fetchTasks }) => {
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

      const response = await api.post(
        `/api/workspace/${workspaceid}/projects/${projectId}/tasks`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response?.data?.message || "Task Created");
      onClose();
      await fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAiDescriptionSubmit = async () => {
    try {
      const response = await api.post(
        "/api/ai/generate-description",
        { title: data.title, description: data.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prev) => ({
        ...prev,
        description: response.data.description,
      }));

      toast.success("Description generated");
    } catch (err) {
      toast.error("AI failed");
    }
  };

  const handleAiPrioritySubmit = async () => {
    try {
      const response = await api.post(
        "/api/ai/suggest-priority",
        { title: data.title, description: data.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prev) => ({
        ...prev,
        priority: response.data.priority.toLowerCase(),
      }));

      toast.success("Priority suggested");
    } catch (err) {
      toast.error("AI failed");
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await api.get(
        `/api/workspace/${workspaceid}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(response.data.members);
    }
    fetchData();
  }, [workspaceid]);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ duration: 0.25 }}
          className="w-[95%] max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl"
        >
          {/* Header */}
          <h2 className="text-2xl font-semibold text-white">
            Create New Task
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Add task details and use AI to speed things up
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="text-sm text-slate-300 block mb-1">
                Title
              </label>
              <input
                name="title"
                value={data.title}
                onChange={handleInput}
                placeholder="Enter task title"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Description + AI */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm text-slate-300">
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleAiDescriptionSubmit}
                  className="text-xs px-3 py-1 rounded-lg bg-linear-to-r from-indigo-500 to-cyan-500 text-white"
                >
                  ✨ Generate
                </button>
              </div>

              <textarea
                name="description"
                value={data.description}
                onChange={handleInput}
                rows={3}
                placeholder="Enter description"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">
                Status
              </label>
              <div className="flex gap-3">
                {["todo", "in_progress", "done"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setData({ ...data, status: item })}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      data.status === item
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority + AI */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-slate-300">
                  Priority
                </label>
                <button
                  type="button"
                  onClick={handleAiPrioritySubmit}
                  className="text-xs px-3 py-1 rounded-lg bg-linear-to-r from-indigo-500 to-cyan-500 text-white"
                >
                  ✨ Suggest
                </button>
              </div>

              <div className="flex gap-3">
                {["low", "medium", "high"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setData({ ...data, priority: item })}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      data.priority === item
                        ? item === "high"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : item === "medium"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                          : "bg-green-500/20 text-green-400 border border-green-500/40"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
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
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white"
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
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                )}
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTaskForm;