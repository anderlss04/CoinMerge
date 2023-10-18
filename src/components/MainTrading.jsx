import TradingViewWidgetAdvanced from "./TradingViewWidgetAdvanced";
import FormularioCompraVenta from "./FormularioCompraVenta";
import HistorialDeOrdenes from "./HistorialDeOrdenes";

export default function Trading({ symbol, exchange }) {
  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Top section - TradingViewWidget and FormularioCompraVenta */}
      <div className="flex flex-row flex-1 h-3/4">
        <div className="w-3/4 border-r p-4">
          <TradingViewWidgetAdvanced symbol={symbol} exchange={exchange} />
        </div>
        <div className="w-1/4 bg-white rounded p-4">
          {/* <h3 className="text-lg font-semibold mb-2">
            Formulario de Compra / Venta
          </h3> */}
          <FormularioCompraVenta />
        </div>
      </div>

      {/* Bottom section - HistorialDeOrdenes */}
      <div className="flex-1 bg-white rounded p-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">
          Historial de Órdenes
        </h3>
        <HistorialDeOrdenes />
      </div>
    </div>
  );
}
