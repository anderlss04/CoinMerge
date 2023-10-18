import React, { useState, useEffect } from "react";

function ListaMonedas() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      const response = await fetch("http://127.0.0.1:5000/listado100");
      const data = await response.json();
      setCoins(data);
    };

    fetchCoins();

    const interval = setInterval(() => {
      fetchCoins();
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);

  const formatNumber = (number) =>
    new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(
      number
    );

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Listado de Criptomonedas
      </h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 w-1/6 text-left font-semibold text-gray-600">Símbolo</th>
            <th className="px-4 py-2 w-1/6 text-left font-semibold text-gray-600">Precio ($)</th>
            <th className="px-4 py-2 w-1/6 text-left font-semibold text-gray-600">Volumen (24h)</th>
            <th className="px-4 py-2 w-1/6 text-left font-semibold text-gray-600">Variación (24h)</th>
            <th className="px-4 py-2 w-1/6 text-left font-semibold text-gray-600">Capitalización de mercado</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr
              key={coin.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-2 border border-gray-300 flex items-center">
                <img
                  src={coin.image}
                  alt={coin.symbol}
                  width="20"
                  className="mr-2 transition-opacity duration-200 ease-in-out opacity-0"
                  onLoad={(e) => (e.target.style.opacity = 1)}
                />
                {coin.symbol.toUpperCase()}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {formatNumber(coin.price)}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {formatNumber(coin.volume)}
              </td>
              <td
                className={`px-4 py-2 border border-gray-300 ${
                  coin.price_change_24h > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.price_change_24h.toFixed(2)}%
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {formatNumber(coin.market_cap)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaMonedas;