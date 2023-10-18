import React, { useState, useEffect } from 'react';
// import ExchangeStats from './ExchangeStats';

const MainInicio = () => {
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    // Aquí podrías hacer una llamada a una API para obtener la lista de exchanges del usuario
    // y luego actualizar el estado con setExchanges
  }, []);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800">Trading Dashboard</h2>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700">
            Exchange Statistics
          </h3>

          {/* <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {exchanges.map((exchange) => (
              <ExchangeStats
                key={exchange.id}
                exchangeName={exchange.name}
                balance={exchange.balance}
                trades={exchange.trades}
              />
            ))}
          </div> */}
        </div>

        {/* Aquí podrías agregar más secciones para mostrar información adicional */}

        <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700">
                Recent Trades
            </h3>

            <div className="mt-4">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left whitespace-no-wrap">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Pair</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Type</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Price</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Amount</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-3">BTC/USDT</td>
                                <td className="px-4 py-3">Buy</td>
                                <td className="px-4 py-3">50,000</td>
                                <td className="px-4 py-3">0.001</td>
                                <td className="px-4 py-3">2021-04-01 12:00:00</td>
                            </tr>
                            <tr>
                                <td className="border-t-2 border-gray-200 px-4 py-3">BTC/USDT</td>
                                <td className="border-t-2 border-gray-200 px-4 py-3">Buy</td>
                                <td className="border-t-2 border-gray-200 px-4 py-3">50,000</td>
                                <td className="border-t-2 border-gray-200 px-4 py-3">0.001</td>
                                <td className="border-t-2 border-gray-200 px-4 py-3">2021-04-01 12:00:00</td>
                            </tr>

                            {/* Aquí podrías iterar sobre los trades y mostrarlos en la tabla */}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <button className="text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg">Load More</button>

                        {/* Aquí podrías agregar un botón para cargar más trades */}

                    </div>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
};

export default MainInicio;
