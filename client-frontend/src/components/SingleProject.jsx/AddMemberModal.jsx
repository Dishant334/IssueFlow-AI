import React, { useEffect, useState } from "react";
import api from "../../../configs/api";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const AddMemberModal = ({ setIsAddMember, projectMembers }) => {
  const [newMembers, setNewMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { workspaceid, projectId } = useParams();
  const token = localStorage.getItem("token");

  const handleCheckbox = (id) => {
    setNewMembers((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newMembers.length === 0) {
      toast.error("Select at least one member");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/api/projects/${projectId}/members`,
        newMembers,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response?.data?.message || "Members added");
      setIsAddMember(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get(
        `/api/workspace/${workspaceid}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllMembers(response.data.members);
    } catch (err) {
      toast.error("Failed to load members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [workspaceid]);

  const availableMembers = allMembers.filter(
    (user) =>
      !projectMembers.some((member) => member.userId === user.userId)
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        onClick={() => setIsAddMember(false)}
      >
        {/* Modal */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-lg mx-4 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
        >
          {/* Header */}
          <h2 className="text-xl font-semibold text-white">
            Add Members
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            Select members to add to this project
          </p>

          {availableMembers.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Members List */}
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {availableMembers.map((member) => (
                  <div
                    key={member.userId}
                    onClick={() => handleCheckbox(member.userId)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer border transition
                      ${
                        newMembers.includes(member.userId)
                          ? "bg-blue-500/10 border-blue-500/40 text-blue-400"
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                      }`}
                  >
                    <span>{member.name}</span>

                    <input
                      type="checkbox"
                      checked={newMembers.includes(member.userId)}
                      readOnly
                    />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddMember(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  )}
                  {loading ? "Adding..." : "Add Members"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center text-slate-400 py-6">
              No members available to add
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddMemberModal;