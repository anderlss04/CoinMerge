import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

let tvScriptLoadingPromise;

export default function TradingViewWidgetAdvanced({ symbol, exchange }) {
  const onLoadScriptRef = useRef();
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);
  const [selectedExchange, setSelectedExchange] = useState(exchange);
  const [availableSymbols, setAvailableSymbols] = useState([]);
  const [availableExchanges, setAvailableExchanges] = useState([]);

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    const fetchAvailableExchanges = () => {
      try {
        const connectedExchangesJSON = Cookies.get("connectedExchanges");
        if (connectedExchangesJSON) {
          const connectedExchanges = JSON.parse(connectedExchangesJSON);
          setAvailableExchanges(connectedExchanges);
        } else {
          console.warn("No hay exchanges disponibles en las cookies");
        }
      } catch (error) {
        console.error("Error al obtener los exchanges disponibles:", error);
      }
    };

    const fetchAvailableSymbols = async () => {
      try {
        const token = Cookies.get("token");

        const response = await fetch(
          `http://127.0.0.1:5000/exchanges/${selectedExchange.toLowerCase()}/listacriptomonedas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const pairNames = Object.keys(data);
        setAvailableSymbols(pairNames);
      } catch (error) {
        console.error("Error al obtener las criptomonedas disponibles:", error);
      }
    };

    tvScriptLoadingPromise.then(() => {
      if (onLoadScriptRef.current) {
        onLoadScriptRef.current();
        fetchAvailableExchanges();
        fetchAvailableSymbols();
      }
    });

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("tradingview_7194a") &&
        "TradingView" in window
      ) {
        const exchange =
          selectedExchange === "Gate"
            ? selectedExchange + "io"
            : selectedExchange;

        new window.TradingView.widget({
          width: "100%",
          height: "95%",
          symbol: `${exchange}:${selectedSymbol}`,
          interval: "D",
          timezone: "Europe/Madrid",
          theme: "light",
          style: "1",
          locale: "es",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          withdateranges: true,
          hide_side_toolbar: false,
          details: true,
          container_id: "tradingview_7194a",
          studies: ["MASimple@tv-basicstudies", "MASimple@tv-basicstudies"],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
        });
      }
    }
  }, [selectedSymbol, selectedExchange]);

  const handleSymbolChange = (event) => {
    setSelectedSymbol(event.target.value);
  };

  const handleExchangeChange = (event) => {
    setSelectedExchange(event.target.value);
  };

  return (
    <div className="tradingview-widget-container h-96">
      <div className="symbol-selection-container flex justify-between items-center mb-4">
        <div className="form-group">
          <label
            htmlFor="exchange"
            className="block text-sm font-medium text-gray-700"
          >
            Exchange
          </label>
          <select
            id="cripto"
            value={selectedExchange}
            onChange={handleExchangeChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
          >
            {availableExchanges.map((exchange) => (
              <option key={exchange} value={exchange}>
                {exchange}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label
            htmlFor="cripto"
            className="block text-sm font-medium text-gray-700"
          >
            Par Cripto
          </label>
          <select
            id="exchange"
            value={selectedSymbol}
            onChange={handleSymbolChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
          >
            {availableSymbols.map((symbol) => (
              <option key={symbol} value={symbol.replace("/", "")}>
                {symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div id="tradingview_7194a" className="w-full h-full" />
    </div>
  );
}
