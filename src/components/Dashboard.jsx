import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import MainInicio from "./MainInicio";
import MainTrading from "./MainTrading";
import Sidebar from "./Sidebar";
import MainContent from "./ListaMonedas";
import MainConectar from "./MainConectar";
import logo from "../assets/logo120.png";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const user = async () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch("http://127.0.0.1:5000/usuario", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUsername(data.username);
      console.log(data);
    } else {
      navigate("/login");
      console.log("Error al obtener el usuario:", response.status);
      console.error(response);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    setTimeout(() => {
      user();
    }, 1000);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderHeader = () => (
    <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-green-800 bg-gradient-to-r from-green-800 via-green-700 to-green-600">
      <div className="flex items-center">
        <img src={logo} alt="Logo de CoinMerge" className="h-8 mr-2" />
        <h3 className="text-white font-semibold text-lg">CoinMerge</h3>
      </div>
      <div className="flex items-center">
        <button className="relative z-10 block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none">
          <img
            className="h-full w-full object-cover"
            src="https://source.unsplash.com/100x100/?portrait"
            alt="Avatar del usuario"
          />
        </button>
        <div className="ml-3">
          <h2 className="text-gray-200 font-semibold text-lg">{username}</h2>
          <Link
            to="#"
            className="text-sm font-medium text-gray-300 hover:text-gray-200"
          >
            Editar perfil
          </Link>
        </div>
      </div>
    </header>
  );

  const renderMainContent = () => (
    <Routes>
      <Route path="/" element={<MainInicio />} />
      <Route path="/mercado" element={<MainContent />} />
      <Route
        path="/operar"
        element={<MainTrading symbol={"ethusdt"} exchange={"kucoin"} />}
      />
      <Route path="/conectar" element={<MainConectar />} />
    </Routes>
  );

  return (
    <div className="flex h-screen">
      {isMobile && (
        <button
          className="text-gray-500 focus:outline-none lg:hidden fixed top-4 right-4"
          onClick={toggleSidebar}
          aria-label="Abrir menú"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
      <Sidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderHeader()}
        <main className="flex-1 overflow-x-hidden overflow-y-auto h-full overflow-hidden">
          <div className="container w-full">{renderMainContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
