import React, { useState } from "react";
import api from "../../../configs/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const InviteForm = ({ setShowInviteForm, setRefresh }) => {
  const [formData, setFormData] = useState("");
  const [loading, setLoading] = useState(false);

  const { workspaceid } = useParams();
  const token = localStorage.getItem("token");

  const onclose = () => {
    setShowInviteForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post(
        `/api/workspace/${workspaceid}/invite`,
        { email: formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Invite Sent Successfully");
      setFormData("");
      setRefresh((r) => !r);
      onclose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onclose}
      >
        {/* Modal */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md mx-4 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
        >
          {/* Header */}
          <h2 className="text-xl font-semibold text-white">
            Invite a team member
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            Enter their email to send an invite
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input */}
            <div>
              <label className="text-sm text-slate-300 block mb-1">
                Email address
              </label>

              <input
                type="email"
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
                placeholder="name@company.com"
                required
                className="
                  w-full bg-slate-800 border border-slate-600 rounded-lg
                  px-4 py-2.5 text-white placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition
                "
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onclose}
                className="px-4 py-2 text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-blue-600 hover:bg-blue-500 text-white
                  transition disabled:opacity-50
                "
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                )}
                {loading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InviteForm;