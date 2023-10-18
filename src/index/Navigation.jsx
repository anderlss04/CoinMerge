import React from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav className="bg-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <NavLink
              to="/cuentas"
              activeClassName="text-white"
              className="text-gray-300 hover:text-white mr-8"
            >
              Cuentas
            </NavLink>
            <NavLink
              to="/transacciones"
              activeClassName="text-white"
              className="text-gray-300 hover:text-white mr-8"
            >
              Transacciones
            </NavLink>
            <NavLink
              to="/informes"
              activeClassName="text-white"
              className="text-gray-300 hover:text-white"
            >
              Informes
            </NavLink>
          </div>
          <div className="flex-shrink-0">
            <button className="flex items-center text-gray-400 hover:text-white">
              <svg
                className="h-6 w-6 fill-current mr-2"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.25C4.5 4.83579 4.83579 4.5 5.25 4.5H18.75C19.1642 4.5 19.5 4.83579 19.5 5.25C19.5 5.66421 19.1642 6 18.75 6H5.25C4.83579 6 4.5 5.66421 4.5 5.25ZM4.5 11.25C4.5 10.8358 4.83579 10.5 5.25 10.5H18.75C19.1642 10.5 19.5 10.8358 19.5 11.25C19.5 11.6642 19.1642 12 18.75 12H5.25C4.83579 12 4.5 11.6642 4.5 11.25ZM5.25 15.75C4.83579 15.75 4.5 16.0858 4.5 16.5C4.5 16.9142 4.83579 17.25 5.25 17.25H18.75C19.1642 17.25 19.5 16.9142 19.5 16.5C19.5 16.0858 19.1642 15.75 18.75 15.75H5.25Z"
                />
              </svg>
              Ajustes
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
