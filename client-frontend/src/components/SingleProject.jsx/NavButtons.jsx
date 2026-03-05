import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavButtons = () => {
  const [projectActive, setProjectActive] = useState("overview");

  const baseStyle =
    "px-4 py-2 rounded-lg text-sm font-medium transition duration-200";

  const activeStyle =
    "bg-white text-indigo-700 shadow";

  const inactiveStyle =
    "bg-indigo-100 text-gray-600 hover:bg-indigo-200";

  return (
    <div className="flex justify-center my-4">
      <div className="flex gap-6 bg-linear-to-br from-blue-100 to-indigo-100 p-3 rounded-2xl shadow-lg">

        <Link
          to="projecto"
          onClick={() => setProjectActive("overview")}
          className={`${baseStyle} ${
            projectActive === "overview" ? activeStyle : inactiveStyle
          }`}
        >
          Overview
        </Link>

        <Link
          to="projectt"
          onClick={() => setProjectActive("projecttasks")}
          className={`${baseStyle} ${
            projectActive === "projecttasks" ? activeStyle : inactiveStyle
          }`}
        >
          Tasks
        </Link>

        <Link
          to="projectm"
          onClick={() => setProjectActive("projectmembers")}
          className={`${baseStyle} ${
            projectActive === "projectmembers" ? activeStyle : inactiveStyle
          }`}
        >
          Members
        </Link>

        <Link
          to="projects"
          onClick={() => setProjectActive("projectsettings")}
          className={`${baseStyle} ${
            projectActive === "projectsettings" ? activeStyle : inactiveStyle
          }`}
        >
          Settings
        </Link>

      </div>
    </div>
  );
};

export default NavButtons;