import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavButtons = ({loading}) => {
  const location=useLocation()
  


  const baseStyle =
    "px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ease-out min-w-20 text-center";

  const activeStyle =
    "bg-white text-black shadow-sm";

  const inactiveStyle =
    "bg-slate-400 hover:text-slate-100 hover:bg-slate-700/60 hover:scale-[1.03] hover:shadow-md hover:shadow-blue-500/10";

      if (loading) {
    return (
      <div className="flex gap-4 px-12 mt-4 animate-pulse justify-center">
        <div className="h-10 w-24 bg-slate-700 rounded-full"></div>
        <div className="h-10 w-24 bg-slate-700 rounded-full"></div>
        <div className="h-10 w-24 bg-slate-700 rounded-full"></div>
        <div className="h-10 w-24 bg-slate-700 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="flex justify-center  my-4">
      <div className="flex gap-6 bg-slate-800 p-3 rounded-2xl shadow-lg ">

        <Link
          to="projecto"
          onClick={() => setProjectActive("overview")}
          className={`${baseStyle} ${
            location.pathname.includes("projecto") ? activeStyle : inactiveStyle
          }`}
        >
          Overview
        </Link>

        <Link
          to="projectt"
          onClick={() => setProjectActive("projecttasks")}
          className={`${baseStyle} ${
            location.pathname.includes("projectt") ? activeStyle : inactiveStyle
          }`}
        >
          Tasks
        </Link>

        <Link
          to="projectm"
          onClick={() => setProjectActive("projectmembers")}
          className={`${baseStyle} ${
            location.pathname.includes("projectm")? activeStyle : inactiveStyle
          }`}
        >
          Members
        </Link>

        <Link
          to="projectsset"
          onClick={() => setProjectActive("projectsettings")}
          className={`${baseStyle} ${
            location.pathname.includes("projectsset")? activeStyle : inactiveStyle
          }`}
        >
          Settings
        </Link>

      </div>
    </div>
  );
};

export default NavButtons;