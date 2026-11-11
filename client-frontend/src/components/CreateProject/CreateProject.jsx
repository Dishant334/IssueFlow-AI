import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../configs/api";

const CreateProject = ({ onclose, setRefresh }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { workspaceid } = useParams();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please fill the project name");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      await api.post(
        `/api/workspace/${workspaceid}/projects`,
        { projectName: name, projectDesc: description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Created New Project Successfully");
      setRefresh((prev) => !prev);
      onclose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div onClick={onclose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        
        {/* Modal */}
        <motion.div onClick={(e)=>e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl"
        >

          {/* Header */}
          <h2 className="text-xl font-semibold text-white">
            Create New Project
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            Add details for your new project
          </p>

          {/* Input */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <textarea
              placeholder="Project description (max 40 characters)"
              maxLength={40}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={onclose}
              className="px-4 py-2 text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
              )}
              {loading ? "Creating..." : "Create Project"}
            </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateProject;