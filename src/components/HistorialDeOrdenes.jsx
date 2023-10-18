import React, { useMemo, useState } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  const handleNewOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  // Ordenar las órdenes por fecha
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.date - a.date);
  }, [orders]);

  // Función para formatear los precios
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800">Historial de Órdenes</h2>
      <div className="mt-8">
        {sortedOrders.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Cantidad</th>
                <th className="px-4 py-2 text-left">Precio</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="border px-4 py-2">
                    {order.date.toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{order.type}</td>
                  <td className="border px-4 py-2">{order.quantity}</td>
                  <td className="border px-4 py-2">
                    {formatPrice(order.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No hay órdenes para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;