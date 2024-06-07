import React from 'react';
import InvoiceChart from './components/invoice-chart';
import QuoteChart from './components/albaran-chart';

const Informes = () => {
  return (
    <>
      <div className="bg-white rounded-xl p-10">
        <div>
          <h1 className="text-2xl font-bold">Facturación en facturas</h1>
          <InvoiceChart />
        </div>
      </div>
      <div className="bg-white rounded-xl p-10 mt-10">
        <div>
          <h1 className="text-2xl font-bold">Facturación en albaranes</h1>
          <QuoteChart />
        </div>
      </div>
    </>
  );
};

export default Informes;
