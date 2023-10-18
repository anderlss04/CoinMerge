import React, { useState, useEffect } from "react";
import logo from "../assets/logo120.png";
import { animated } from "react-spring";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <animated.header className="mx-auto bg-gradient-to-r from-green-600 via-green-700 to-green-800">
      <div className="container w-full flex justify-between items-center py-4">
        <a href="/" className="flex items-center">
          <img src={logo} alt="CoinMerge" className="h-10" />
          <h1 className="text-white font-semibold text-lg">CoinMerge</h1>
        </a>
        <button
          className="md:hidden rounded-lg py-2 px-4 font-medium text-white hover:bg-green-700"
          onClick={toggleMenu}
        >
          Menú
        </button>
        <nav className={`md:flex space-x-4 ${showMenu ? "" : "hidden"}`}>
          <a
            href="/es/portfolio-landing/"
            className="text-white hover:text-gray-300 font-medium"
          >
            Portafolio
          </a>
          <a
            href="/es/swap/"
            className="text-white hover:text-gray-300 font-medium"
          >
            Operaciones
          </a>
          <a
            href="/es/coins/"
            className="text-white hover:text-gray-300 font-medium"
          >
            Criptomonedas
          </a>
        </nav>
        <div className="hidden md:flex items-center ">
          <a
            href="/login/"
            className="text-white hover:bg-green-700 rounded-lg py-2 px-4 font-medium mr-6"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </animated.header>
  );
}

export default Header;
