import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AddMemberModal from "./AddMemberModal";

const Members = () => {
  const [isAddMember, setIsAddMember] = useState(false);
  const {loading}=useOutletContext()

  const { singleProject, permissions } = useOutletContext();
  const admin = permissions.canManageMembers;

  const deleteMember = (memberId) => {
    console.log("remove member", memberId);
  };

  const promoteMember = (memberId) => {
    console.log("promote member", memberId);
  };
   if(loading){
      return  <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
  <div className="w-10 h-10 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
</div>
    }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl font-semibold">Members</p>

        {admin && (
          <button
            onClick={() => setIsAddMember(true)}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition shadow-md hover:scale-105"
          >
            + Add Member
          </button>
        )}
      </div>

      {/* Card Container */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-md overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-5 px-6 py-3 text-sm text-slate-400 border-b border-slate-700">
          <p>Name</p>
          <p>Joined</p>
          <p>Role</p>
          {admin && <p className="text-center">Remove</p>}
          {admin && <p className="text-center">Promote</p>}
        </div>

        {/* Members */}
        {singleProject?.projectMembers?.map((m) => (
          <div
            key={m.userId}
            className="grid grid-cols-5 items-center px-6 py-4 border-b border-slate-700 last:border-none hover:bg-slate-700/40 transition"
          >

            {/* Name + Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">
                {m.name?.charAt(0)}
              </div>
              <p className="text-sm text-slate-200">{m.name}</p>
            </div>

            {/* Joined */}
            <p className="text-sm text-slate-400">
              {new Date(m.joinedAt)
                .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                .split(",")[0]}
            </p>

            {/* Role */}
            <div>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  m.role === "project_admin"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {m.role === "project_admin" ? "Admin" : "Member"}
              </span>
            </div>

            {/* Remove */}
            {admin && (
              <div className="text-center">
                <button
                  disabled={m.role === "project_admin"}
                  onClick={() => deleteMember(m.userId)}
                  className={`px-3 py-1 rounded-md text-xs transition ${
                    m.role === "project_admin"
                      ? "text-slate-500 cursor-not-allowed"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  }`}
                >
                  Remove
                </button>
              </div>
            )}

            {/* Promote */}
            {admin && (
              <div className="text-center">
                <button
                  disabled={m.role === "project_admin"}
                  onClick={() => promoteMember(m.userId)}
                  className={`px-3 py-1 rounded-md text-xs transition ${
                    m.role === "project_admin"
                      ? "text-slate-500 cursor-not-allowed"
                      : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  }`}
                >
                  Promote
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isAddMember && (
        <AddMemberModal
          setIsAddMember={setIsAddMember}
          projectMembers={singleProject.projectMembers}
        />
      )}
    </div>
  );
};

export default Members;