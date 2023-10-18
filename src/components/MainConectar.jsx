import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function ExchangeModal({ exchange, closeModal }) {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [apiPassphrase, setApiPassphrase] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const exchangeConectado = {};
  const navigate = useNavigate();

  const connectToExchange = async () => {
    if (!apiKey || !apiSecret || !apiPassphrase) {
      setErrorMessage("**Todos los campos son obligatorios");
      return;
    }

    const apiUrl = `http://127.0.0.1:5000/exchanges/${exchange.label.toLowerCase()}`;

    const payload = {
      api_key: apiKey,
      secret_key: apiSecret,
      api_password: apiPassphrase,
    };

    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      switch (response.status) {
        case 200:
          const connectedExchangesJSON = Cookies.get("connectedExchanges");
          let connectedExchanges;

          if (connectedExchangesJSON) {
            connectedExchanges = JSON.parse(connectedExchangesJSON);
          } else {
            connectedExchanges = [];
          }

          if (!connectedExchanges.includes(exchange.label)) {
            connectedExchanges.push(exchange.label);
          }

          Cookies.set(
            "connectedExchanges",
            JSON.stringify(connectedExchanges),
            {
              expires: 7,
            }
          );

          closeModal();
          break;

        default:
          throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setErrorMessage("**Error al conectar al exchange");
      console.error("Error al conectar al exchange:", error);
    }
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleApiSecretChange = (event) => {
    setApiSecret(event.target.value);
  };

  const handleApiPassphraseChange = (event) => {
    setApiPassphrase(event.target.value);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  Conectar a {exchange.label}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Ingresa las credenciales de la API para conectar con{" "}
                    {exchange.label}.
                  </p>
                  <div className="mt-4">
                    <label
                      htmlFor="apiKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      API Key
                    </label>
                    <input
                      type="text"
                      name="apiKey"
                      id="apiKey"
                      value={apiKey}
                      onChange={handleApiKeyChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="apiSecret"
                      className="block text-sm font-medium text-gray-700"
                    >
                      API Secret
                    </label>
                    <input
                      type="text"
                      name="apiSecret"
                      id="apiSecret"
                      value={apiSecret}
                      onChange={handleApiSecretChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="apiPassphrase"
                      className="block text-sm font-medium text-gray-700"
                    >
                      API Passphrase
                    </label>
                    <input
                      type="text"
                      name="apiPassphrase"
                      id="apiPassphrase"
                      value={apiPassphrase}
                      onChange={handleApiPassphraseChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Esta información es almacenada de forma segura
                  </p>
                  {errorMessage && (
                    <h1 className="text-sm text-red-500">{errorMessage}</h1>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={connectToExchange} // Llama a la función connectToExchange al hacer clic en el botón "Conectar"
            >
              Conectar
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExchangeConnect() {
  const [selectedExchange, setSelectedExchange] = useState(null);

  const closeModal = () => {
    setSelectedExchange(null);
  };

  return (
    <div className="intro bg-white min-h-screen flex flex-col justify-center">
      <div className="main-texts max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="heading-wrapper mb-8">
          <div className="heading-inner text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Gestiona tu portafolio de Cripto y DeFi
            </h1>
            <p className="text-lg">
              Conectarse de forma segura al portafolio en uso para empezar
            </p>
          </div>
        </div>
        <div className="portfolios">
          <div className="portfolios-wrapper flexitems-center justify-center">
            <div className="portfolio-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                className="portfolio-item bg-gray-100 rounded-lg p-6 text-center cursor-pointer"
                onClick={() => setSelectedExchange({ label: "Binance" })}
              >
                <h2 className="text-xl font-bold">Binance</h2>
              </div>
              <div
                className="portfolio-item bg-gray-100 rounded-lg p-6 text-center cursor-pointer"
                onClick={() => setSelectedExchange({ label: "Kucoin" })}
              >
                <h2 className="text-xl font-bold">Kucoin</h2>
              </div>
              <div
                className="portfolio-item bg-gray-100 rounded-lg p-6 text-center cursor-pointer"
                onClick={() => setSelectedExchange({ label: "Gate" })}
              >
                <h2 className="text-xl font-bold">Gate.io</h2>
              </div>
              <div
                className="portfolio-item bg-gray-100 rounded-lg p-6 text-center cursor-pointer"
                onClick={() => setSelectedExchange({ label: "CoinBase" })}
              >
                <h2 className="text-xl font-bold">CoinBase</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedExchange && (
        <ExchangeModal exchange={selectedExchange} closeModal={closeModal} />
      )}
    </div>
  );
}

export default ExchangeConnect;
