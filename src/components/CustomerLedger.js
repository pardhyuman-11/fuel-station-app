import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExportCustomerLedger from './ExportCustomerLedger';

export default function CustomerLedger({ logs, language, setLogs }) {
  const { name } = useParams();
  const navigate = useNavigate();

  const [amountReceived, setAmountReceived] = useState('');
  const [comment, setComment] = useState('');

  const customerLogs = logs.filter(log => log.name === name);

  const balance = customerLogs.reduce((acc, log) => {
    const total = log.quantity * log.price || log.amount || 0;
    return log.type === 'Payment' ? acc - total : log.status === 'Due' ? acc + total : acc - total;
  }, 0);

  const handlePayment = () => {
    const amt = parseFloat(amountReceived);
    if (isNaN(amt) || amt <= 0) return alert("Enter valid amount");

    const payment = {
      type: 'Payment',
      name,
      amount: amt,
      date: new Date().toISOString(),
      status: 'Paid',
      comment
    };

    setLogs(prev => [...prev, payment]);
    setAmountReceived('');
    setComment('');
  };

  return (
    <div className="bg-[#121212] text-white p-4 rounded-xl max-w-4xl mx-auto shadow-xl mt-6">
      <button onClick={() => navigate(-1)} className="text-blue-400 underline mb-4">
        ← {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
      </button>

      <h2 className="text-lg font-bold mb-2 text-yellow-300">
        {language === 'hi' ? 'ग्राहक खाता' : 'Customer Ledger'}: {name}
      </h2>

      <p className={`mb-4 font-semibold ${balance >= 0 ? 'text-red-500' : 'text-green-400'}`}>
        {language === 'hi' ? 'बैलेंस' : 'Balance'}: ₹{Math.abs(balance).toFixed(2)} {balance > 0 ? '(Due)' : '(Advance)'}
      </p>

      <ExportCustomerLedger name={name} logs={logs} language={language} />

      <div className="bg-[#1c1c1c] p-4 rounded mb-6 shadow mt-6">
        <h3 className="text-md font-semibold mb-2 text-green-400">
          {language === 'hi' ? 'भुगतान प्राप्त करें' : 'Receive Payment'}
        </h3>
        <input
          type="number"
          placeholder={language === 'hi' ? 'राशि (₹)' : 'Amount (₹)'}
          value={amountReceived}
          onChange={e => setAmountReceived(e.target.value)}
          className="p-2 mb-2 w-full rounded bg-[#2a2a2a] text-white"
        />
        <input
          type="text"
          placeholder={language === 'hi' ? 'टिप्पणी (वैकल्पिक)' : 'Comment (optional)'}
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="p-2 mb-2 w-full rounded bg-[#2a2a2a] text-white"
        />
        <button
          onClick={handlePayment}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {language === 'hi' ? 'भुगतान जोड़ें' : 'Add Payment'}
        </button>
      </div>

      {customerLogs.length === 0 ? (
        <p className="text-gray-400">{language === 'hi' ? 'कोई लेनदेन नहीं मिला।' : 'No transactions found.'}</p>
      ) : (
        <div className="space-y-4">
          {customerLogs.map((log, i) => (
            <div key={i} className="bg-[#1f1f1f] p-3 rounded shadow">
              <div className="text-sm text-gray-400">{new Date(log.date).toLocaleString()}</div>
              {log.type === 'Payment' ? (
                <>
                  <div>💵 {language === 'hi' ? 'भुगतान प्राप्त' : 'Payment Received'}: ₹{log.amount.toFixed(2)}</div>
                  {log.comment && <div className="text-sm mt-1">📝 {log.comment}</div>}
                </>
              ) : (
                <>
                  <div>⛽ {log.fuelType} - {log.quantity}L @ ₹{log.price} = ₹{(log.quantity * log.price).toFixed(2)}</div>
                  <div className="text-sm mt-1">💳 {language === 'hi' ? 'स्थिति' : 'Status'}: {log.status}</div>
                  {log.comment && <div className="text-sm mt-1">📝 {log.comment}</div>}
                  {log.file && (
                    <div className="text-sm mt-1">
                      📎 <a href={log.file} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                        {language === 'hi' ? 'संलग्न फ़ाइल देखें' : 'View attached file'}
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
