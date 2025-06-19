import React, { useState } from 'react';

export default function SalesPage({ logs, language }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filterLogs = (filterFn) => logs.filter(filterFn);

  const calcStats = (filteredLogs) => {
    const petrol = filteredLogs.filter(log => log.fuelType === 'petrol');
    const diesel = filteredLogs.filter(log => log.fuelType === 'diesel');

    const sum = (items) => items.reduce((acc, log) => acc + log.price * log.quantity, 0);
    const liters = (items) => items.reduce((acc, log) => acc + log.quantity, 0);

    return {
      total: sum(filteredLogs),
      petrolLiters: liters(petrol),
      dieselLiters: liters(diesel),
      profit: sum(filteredLogs) * 0.03 // assuming fixed 3% profit margin
    };
  };

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const selected = new Date(selectedDate);

  const todayStats = calcStats(filterLogs(log => new Date(log.date).toDateString() === today.toDateString()));
  const weeklyStats = calcStats(filterLogs(log => new Date(log.date) >= startOfWeek));
  const monthlyStats = calcStats(filterLogs(log => new Date(log.date) >= startOfMonth));
  const yearlyStats = calcStats(filterLogs(log => new Date(log.date) >= startOfYear));
  const selectedStats = calcStats(filterLogs(log => {
    const logDate = new Date(log.date);
    return logDate.toDateString() === selected.toDateString();
  }));

  const block = (title, stats) => (
    <div className="bg-[#1c1c1c] p-4 rounded shadow mb-4">
      <h3 className="text-yellow-300 font-semibold mb-2">{title}</h3>
      <p>💰 {language === 'hi' ? 'कुल बिक्री:' : 'Total Sale:'} ₹{stats.total.toFixed(2)}</p>
      <p>⛽ {language === 'hi' ? 'पेट्रोल:' : 'Petrol:'} {stats.petrolLiters}L</p>
      <p>⛽ {language === 'hi' ? 'डीज़ल:' : 'Diesel:'} {stats.dieselLiters}L</p>
      <p>📈 {language === 'hi' ? 'लाभ:' : 'Profit:'} ₹{stats.profit.toFixed(2)}</p>
    </div>
  );

  return (
    <div className="bg-[#121212] text-white p-4 rounded-xl max-w-4xl mx-auto shadow-xl mt-6">
      <h2 className="text-lg font-bold mb-4 text-orange-400">
        {language === 'hi' ? 'बिक्री सारांश' : 'Sales Summary'}
      </h2>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-300">
          {language === 'hi' ? 'तारीख चुनें:' : 'Select a date:'}
        </label>
        <input
          type="date"
          className="bg-[#1f1f1f] text-white p-2 rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {block(language === 'hi' ? 'चयनित दिन की बिक्री' : 'Selected Day’s Sale', selectedStats)}
      {block(language === 'hi' ? 'आज की बिक्री' : 'Today’s Sale', todayStats)}
      {block(language === 'hi' ? 'इस सप्ताह की बिक्री' : 'Weekly Sale', weeklyStats)}
      {block(language === 'hi' ? 'इस माह की बिक्री' : 'Monthly Sale', monthlyStats)}
      {block(language === 'hi' ? 'इस वर्ष की बिक्री' : 'Yearly Sale', yearlyStats)}
    </div>
  );
}
