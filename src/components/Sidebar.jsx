import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gradient-to-r from-green-600  to-green-700 text-gray-100 flex justify-between">
      <div className="p-4 flex flex-col">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <nav className="mt-6">
          <Link
            className="block py-2.5 px-4 rounded-lg hover:bg-green-700 transition duration-200"
            to="/dashboard"
          >
            <span className="text-gray-300 hover:text-white">Inicio</span>
          </Link>
          <Link
            className="block py-2.5 px-4 rounded-lg hover:bg-green-700 transition duration-200"
            to="/dashboard/operar"
          >
            <span className="text-gray-300 hover:text-white">Operaciones</span>
          </Link>
          <Link
            className="block py-2.5 px-4 rounded-lg hover:bg-green-700 transition duration-200"
            to="/dashboard/mercado"
          >
            <span className="text-gray-300 hover:text-white">Mercado</span>
          </Link>
          <Link
            className="block py-2.5 px-4 rounded-lg hover:bg-green-700 transition duration-200"
            to="/dashboard/conectar"
          >
            <span className="text-gray-300 hover:text-white">Conectar Exchange</span>
          </Link>
        </nav>
      </div>
      <div className="p-4">
        <button className="text-gray-300 hover:text-white focus:outline-none">
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
