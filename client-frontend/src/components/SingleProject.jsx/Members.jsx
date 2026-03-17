import React, { useState } from "react";
import {  useOutletContext } from "react-router-dom";
import AddMemberModal from "./AddMemberModal";

const Members = () => {
  const [isAddMember,setIsAddMember]=useState(false)

  const { singleProject } = useOutletContext();

  const admin = true; // replace later with role check

  const deleteMember = (memberId) => {
    console.log("remove member", memberId);
  };

  const promoteMember = (memberId) => {
    console.log("promote member", memberId);
  };

  return (
    <div className="p-6 relative">

      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-semibold">Members</p>

        {admin && (
          <button onClick={()=> setIsAddMember(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Add Member
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">

        <table className="min-w-full border-collapse">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Name
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Joined
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                Role
              </th>

              {admin && (
                <>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase">
                    Remove
                  </th>

                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase">
                    Promote
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">

            {singleProject?.projectMembers?.map((m) => (
              <tr
                key={m.userId}
                className="hover:bg-gray-50 transition"
              >

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {m.name}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(m.joinedAt)
                    .toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })
                    .split(",")[0]}
                </td>

                <td className="px-6 py-4 text-sm">

                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${
                        m.role === "project_admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {m.role}
                  </span>

                </td>

                {admin && (
                  <td className="px-6 py-4 text-center">

                    <button
                      disabled={m.role === "project_admin"}
                      onClick={() => deleteMember(m.userId)}
                      className={`text-sm font-medium
                        ${
                          m.role === "project_admin"
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:text-red-700 hover:underline"
                        }`}
                    >
                      Remove
                    </button>

                  </td>
                )}

                {admin && (
                  <td className="px-6 py-4 text-center">

                    <button
                      disabled={m.role === "project_admin"}
                      onClick={() => promoteMember(m.userId)}
                      className={`text-sm font-medium
                        ${
                          m.role === "project_admin"
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-green-600 hover:text-green-700 hover:underline"
                        }`}
                    >
                      Promote
                    </button>

                  </td>
                )}

              </tr>
            ))}

          </tbody>

        </table>

      </div>
      {isAddMember && <AddMemberModal setIsAddMember={setIsAddMember} projectMembers={singleProject.projectMembers}/>}

    </div>
  );
};

export default Members;