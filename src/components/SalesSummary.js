import React, { useState } from 'react';

export default function SalesSummary({ logs, language }) {
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState('');

  const filterBy = (callback) => logs.filter(log => callback(new Date(log.date)));

  const getTotal = (filteredLogs) =>
    filteredLogs.reduce((acc, log) => acc + (log.price * log.quantity), 0);

  const getLiters = (filteredLogs, type) =>
    filteredLogs
      .filter(log => log.fuelType === type)
      .reduce((sum, log) => sum + parseFloat(log.quantity), 0);

  const getFuelValue = (filteredLogs, type) =>
    filteredLogs
      .filter(log => log.fuelType === type)
      .reduce((sum, log) => sum + (log.price * log.quantity), 0);

  const todayLogs = filterBy(date => date.toDateString() === now.toDateString());
  const weekLogs = filterBy(date => (now - date) / (1000 * 60 * 60 * 24) < 7);
  const monthLogs = filterBy(date => date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear());
  const yearLogs = filterBy(date => date.getFullYear() === now.getFullYear());
  const selectedLogs = selectedDate
    ? logs.filter(log => new Date(log.date).toDateString() === new Date(selectedDate).toDateString())
    : [];

  const totalPetrolLiters = getLiters(logs, 'petrol');
  const totalDieselLiters = getLiters(logs, 'diesel');
  const petrolValue = getFuelValue(logs, 'petrol');
  const dieselValue = getFuelValue(logs, 'diesel');

  return (
    <div className="bg-[#111] text-white p-4 rounded-xl mt-4 mb-6 max-w-3xl mx-auto shadow-xl">
      <h2 className="text-lg font-bold mb-3 text-green-400">
        {language === 'hi' ? 'बिक्री सारांश' : 'Sales Summary'}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div>📅 {language === 'hi' ? 'आज की बिक्री' : 'Today'}: <b>₹{getTotal(todayLogs).toFixed(2)}</b></div>
        <div>🗓️ {language === 'hi' ? 'इस सप्ताह' : 'This Week'}: <b>₹{getTotal(weekLogs).toFixed(2)}</b></div>
        <div>📆 {language === 'hi' ? 'इस माह' : 'This Month'}: <b>₹{getTotal(monthLogs).toFixed(2)}</b></div>
        <div>📈 {language === 'hi' ? 'इस वर्ष' : 'This Year'}: <b>₹{getTotal(yearLogs).toFixed(2)}</b></div>
        <div>💰 {language === 'hi' ? 'कुल बिक्री' : 'Total Sales'}: <b>₹{getTotal(logs).toFixed(2)}</b></div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="bg-[#222] p-3 rounded">
          🟠 {language === 'hi' ? 'पेट्रोल' : 'Petrol'}: <b>{totalPetrolLiters.toFixed(2)}L</b> &nbsp;
          ₹<b>{petrolValue.toFixed(2)}</b>
        </div>
        <div className="bg-[#222] p-3 rounded">
          🟢 {language === 'hi' ? 'डीज़ल' : 'Diesel'}: <b>{totalDieselLiters.toFixed(2)}L</b> &nbsp;
          ₹<b>{dieselValue.toFixed(2)}</b>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2 text-yellow-300">
          {language === 'hi' ? 'किसी दिन की बिक्री देखें' : 'View Sales for Specific Date'}
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-[#222] text-white p-2 rounded border border-gray-700"
        />

        {selectedDate && (
          <p className="mt-3 text-sm">
            📌 {language === 'hi' ? 'चयनित दिन की बिक्री' : 'Sales on'} {new Date(selectedDate).toDateString()}: &nbsp;
            <b>₹{getTotal(selectedLogs).toFixed(2)}</b>
          </p>
        )}
      </div>
    </div>
  );
}
