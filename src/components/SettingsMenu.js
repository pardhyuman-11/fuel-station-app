import React, { useState } from 'react';

export default function SettingsMenu({ tank, prices, updateTankCapacity, refillFuel, updatePrice, language }) {
  const [refillAmount, setRefillAmount] = useState({ petrol: '', diesel: '' });
  const [subtractAmount, setSubtractAmount] = useState({ petrol: '', diesel: '' });

  const handleRefill = (type) => {
    const qty = parseFloat(refillAmount[type]);
    if (!isNaN(qty) && qty > 0) {
      refillFuel(type, qty);
      setRefillAmount({ ...refillAmount, [type]: '' });
    }
  };

  const handleSubtract = (type) => {
    const qty = parseFloat(subtractAmount[type]);
    if (!isNaN(qty) && qty > 0) {
      refillFuel(type, -qty);
      setSubtractAmount({ ...subtractAmount, [type]: '' });
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-300">{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</h2>

      {['petrol', 'diesel'].map((type) => (
        <div key={type} className="mb-4">
          <h3 className="text-lg font-semibold text-green-400">
            {language === 'hi' ? (type === 'petrol' ? 'पेट्रोल' : 'डीज़ल') : type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <div className="flex gap-2 flex-wrap mb-2">
            <input
              type="number"
              placeholder={language === 'hi' ? 'टैंक क्षमता' : 'Tank Capacity'}
              value={tank[type]}
              onChange={e => updateTankCapacity(type, parseFloat(e.target.value) || 0)}
              className="w-40"
            />
            <input
              type="number"
              placeholder={language === 'hi' ? 'रीफिल मात्रा' : 'Refill Amount'}
              value={refillAmount[type]}
              onChange={e => setRefillAmount({ ...refillAmount, [type]: e.target.value })}
              className="w-40"
            />
            <button onClick={() => handleRefill(type)} className="menu-button">
              {language === 'hi' ? 'जोड़ें' : 'Add'}
            </button>
            <input
              type="number"
              placeholder={language === 'hi' ? 'घटाएं मात्रा' : 'Subtract Amount'}
              value={subtractAmount[type]}
              onChange={e => setSubtractAmount({ ...subtractAmount, [type]: e.target.value })}
              className="w-40"
            />
            <button onClick={() => handleSubtract(type)} className="menu-button bg-red-600 hover:bg-red-700">
              {language === 'hi' ? 'घटाएं' : 'Subtract'}
            </button>
          </div>
        </div>
      ))}

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-yellow-400">{language === 'hi' ? 'आज के ईंधन मूल्य' : 'Today’s Fuel Prices'}</h3>
        <div className="flex gap-4 mt-2 flex-wrap">
          <input
            type="number"
            placeholder="Petrol ₹"
            value={prices.petrol}
            onChange={e => updatePrice('petrol', parseFloat(e.target.value) || 0)}
            className="w-40"
          />
          <input
            type="number"
            placeholder="Diesel ₹"
            value={prices.diesel}
            onChange={e => updatePrice('diesel', parseFloat(e.target.value) || 0)}
            className="w-40"
          />
        </div>
      </div>
    </div>
  );
}
