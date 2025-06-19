import React from 'react';

export default function SalesLog({ logs, language }) {
  return (
    <div className="bg-[#1a1a1a] text-white p-4 rounded-xl max-w-3xl mx-auto mb-8 shadow-lg">
      <h2 className="text-lg font-bold mb-3 text-blue-300">
        {language === 'hi' ? 'आज की बिक्री लॉग' : 'Today’s Sales Log'}
      </h2>

      {logs.length === 0 ? (
        <p className="text-gray-400">{language === 'hi' ? 'कोई बिक्री नहीं हुई।' : 'No sales yet.'}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-yellow-400 text-left">
              <th>{language === 'hi' ? 'ग्राहक' : 'Customer'}</th>
              <th>{language === 'hi' ? 'ईंधन' : 'Fuel'}</th>
              <th>{language === 'hi' ? 'मात्रा (L)' : 'Qty (L)'}</th>
              <th>{language === 'hi' ? 'मूल्य (₹)' : 'Amount (₹)'}</th>
              <th>{language === 'hi' ? 'स्थिति' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td>{log.name || '-'}</td>
                <td>{log.fuelType}</td>
                <td>{log.quantity}</td>
                <td>₹{log.price * log.quantity}</td>
                <td className={log.status === 'Due' ? 'text-red-500' : 'text-green-400'}>
                  {language === 'hi'
                    ? log.status === 'Due' ? 'बकाया' : 'भुगतान'
                    : log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
