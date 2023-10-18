import React from "react";
import logo from "../assets/logo120.png";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-600 via-green-700 to-green-800">
  <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="Logo de CoinMerge" className="h-8 mr-2" />
        <h3 className="text-white font-semibold text-lg">CoinMerge</h3>
      </div>
      <ul className="flex space-x-4">
        <li>
          <a
            href="/acerca-de"
            className="text-white hover:text-slate-300 transition duration-150 ease-in-out"
          >
            Acerca de
          </a>
        </li>
        <li>
          <a
            href="/terminos"
            className="text-white hover:text-slate-300 transition duration-150 ease-in-out"
          >
            Términos
          </a>
        </li>
        <li>
          <a
            href="/privacidad"
            className="text-white hover:text-slate-300 transition duration-150 ease-in-out"
          >
            Privacidad
          </a>
        </li>
      </ul>
    </div>
    <div className="mt-6 text-gray-300 text-sm">
      <p>© 2023 CoinMerge. Todos los derechos reservados.</p>
      <p>
        Este sitio web es solo para fines informativos y no constituye
        asesoramiento financiero. Invertir en criptomonedas implica riesgos,
        y solo deberías invertir lo que puedas permitirte perder.
      </p>
    </div>
  </div>
</footer>

  );
}

export default Footer;
