import React from 'react';

export default function Ledger({ logs, language }) {
  // Group sales by customer
  const customerLedger = {};

  logs.forEach(log => {
    const key = log.name || 'Unknown';
    if (!customerLedger[key]) {
      customerLedger[key] = {
        phone: log.phone || '',
        transactions: [],
        balance: 0,
      };
    }

    const amount = log.price * log.quantity;

    if (log.status === 'Due') {
      customerLedger[key].balance += amount;
    } else {
      customerLedger[key].balance -= amount;
    }

    customerLedger[key].transactions.push({
      date: new Date(log.date).toLocaleString(),
      fuel: log.fuelType,
      qty: log.quantity,
      price: log.price,
      total: amount,
      status: log.status,
      comment: log.comment || '',
    });
  });

  return (
    <div className="bg-[#121212] text-white p-4 rounded-xl max-w-4xl mx-auto shadow-xl mt-6">
      <h2 className="text-lg font-bold mb-4 text-orange-400">
        {language === 'hi' ? 'खाता विवरण' : 'Customer Ledger'}
      </h2>

      {Object.entries(customerLedger).length === 0 ? (
        <p className="text-gray-400">{language === 'hi' ? 'कोई खाता नहीं मिला।' : 'No ledger records found.'}</p>
      ) : (
        Object.entries(customerLedger).map(([name, data], i) => (
          <div key={i} className="mb-6 border-b border-gray-700 pb-4">
            <h3 className="text-yellow-300 text-md font-semibold mb-1">{name} {data.phone && `(${data.phone})`}</h3>
            <p className={`mb-2 ${data.balance > 0 ? 'text-red-500' : 'text-green-400'}`}>
              {language === 'hi' ? 'बैलेंस:' : 'Balance:'} ₹{Math.abs(data.balance).toFixed(2)} {' '}
              {data.balance > 0 ? (language === 'hi' ? '(बकाया)' : '(Due)') : (language === 'hi' ? '(एडवांस)' : '(Advance)')}
            </p>

            <div className="text-sm">
              {data.transactions.map((t, idx) => (
                <div key={idx} className="bg-[#1c1c1c] p-2 rounded mb-1">
                  <div>📅 {t.date}</div>
                  <div>⛽ {t.fuel} - {t.qty}L @ ₹{t.price} = ₹{t.total.toFixed(2)}</div>
                  <div>💳 {language === 'hi' ? 'स्थिति:' : 'Status:'} {t.status}</div>
                  {t.comment && <div>📝 {language === 'hi' ? 'टिप्पणी:' : 'Note:'} {t.comment}</div>}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
