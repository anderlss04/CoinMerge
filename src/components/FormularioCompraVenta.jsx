import React, { useState } from "react";

const FormularioCompraVenta = () => {
  const [buySell, setBuySell] = useState("compra");
  const [type, setType] = useState("mercado");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [stopPrice, setStopPrice] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí podrías enviar la orden a través de una API o alguna otra lógica
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setPrice(0);
    setStopPrice(0);
  };

  const getButtonColor = () => {
    return buySell === "compra" ? "bg-green-500" : "bg-red-500";
  };

  const getButtonColorHover = () => {
    return buySell === "compra" ? "hover:bg-green-600" : "hover:bg-red-600";
  };

  const getInputBorderColor = () => {
    return buySell === "compra" ? "border-green-500" : "border-red-500";
  };

  return (
    <div className="container mx-auto px-6 py-8 ">
      <h2 className="text-2xl font-bold text-gray-800">Trading</h2>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700">
          Nueva Orden de {buySell === "compra" ? "Compra" : "Venta"}
        </h3>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex items-center">
            <label
              htmlFor="compra"
              className="inline-flex items-center mr-4 cursor-pointer"
            >
              <input
                type="radio"
                id="compra"
                name="buySell"
                value="compra"
                checked={buySell === "compra"}
                onChange={() => setBuySell("compra")}
                className="form-radio h-5 w-5 text-green-600"
              />
              <span className="ml-2 text-gray-700">Compra</span>
            </label>
            <label
              htmlFor="venta"
              className="inline-flex items-center cursor-pointer"
            >
              <input
                type="radio"
                id="venta"
                name="buySell"
                value="venta"
                checked={buySell === "venta"}
                onChange={() => setBuySell("venta")}
                className="form-radio h-5 w-5 text-red-600"
              />
              <span className="ml-2 text-gray-700">Venta</span>
            </label>
          </div>

          <div className="mt-4">
            <label htmlFor="tipo" className="block text-gray-700 font-bold">
              Tipo de Orden
            </label>
            <select
              id="tipo"
              name="tipo"
              value={type}
              onChange={handleTypeChange}
              className={`mt-1 block w-full px-4 py-2 border ${getInputBorderColor()} bg-white rounded-md shadow-sm focus:outline-none focus:ring ${getInputBorderColor()} sm:text-sm`}
            >
              <option value="mercado">Mercado</option>
              <option value="limite">Límite</option>
              <option value="stoplimit">Stop-Limit</option>
              <option value="stopmercado">Stop-Mercado</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="cantidad" className="block text-gray-700 font-bold">
              Cantidad
            </label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${getInputBorderColor()} bg-white rounded-md shadow-sm focus:outline-none focus:ring ${getInputBorderColor()} sm:text-sm`}
            />
          </div>

          {type === "limite" && (
            <div className="mt-4">
              <label htmlFor="precio" className="block text-gray-700 font-bold">
                Precio
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className={`mt-1 block w-full px-4 py-2 border ${getInputBorderColor()} bg-white rounded-md shadow-sm focus:outline-none focus:ring ${getInputBorderColor()} sm:text-sm`}
              />
            </div>
          )}

          {(type === "stoplimit" || type === "stopmercado") && (
            <div className="mt-4">
              <label
                htmlFor="stop-precio"
                className="block text-gray-700 font-bold"
              >
                Precio de Stop
              </label>
              <input
                type="number"
                id="stop-precio"
                name="stop-precio"
                value={stopPrice}
                onChange={(event) => setStopPrice(event.target.value)}
                className={`mt-1 block w-full px-4 py-2 border ${getInputBorderColor()} bg-white rounded-md shadow-sm focus:outline-none focus:ring ${getInputBorderColor()} sm:text-sm`}
              />

              {type === "stoplimit" && (
                <div className="mt-4">
                  <label
                    htmlFor="precio"
                    className="block text-gray-700 font-bold"
                  >
                    Precio Límite
                  </label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border ${getInputBorderColor()} bg-white rounded-md shadow-sm focus:outline-none focus:ring ${getInputBorderColor()} sm:text-sm`}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              className={`${getButtonColor()} text-white px-4 py-2 rounded-md ${getButtonColorHover()} focus:outline-none `}
            >
              Enviar Orden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCompraVenta;
