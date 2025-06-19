import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import TankStatus from './components/TankStatus';
import FuelSaleForm from './components/FuelSaleForm';
import SalesLog from './components/SalesLog';
import SettingsMenu from './components/SettingsMenu';
import CustomerCatalog from './components/CustomerCatalog';
import ExportPDF from './components/ExportPDF';
import SalesSummary from './components/SalesSummary';
import CustomerLedger from './components/CustomerLedger';
import ViewLedger from './pages/ViewLedger';

import { auth, db } from './firebase';
import './App.css';

function Dashboard({ user }) {
  const [tank, setTank] = useState({ petrol: 500, diesel: 500 });
  const [remaining, setRemaining] = useState({ petrol: 500, diesel: 500 });
  const [logs, setLogs] = useState([]);
  const [language, setLanguage] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [prices, setPrices] = useState({ petrol: 100, diesel: 90 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('fuelAppData'));
    if (saved) {
      setTank(saved.tank);
      setRemaining(saved.remaining);
      setLogs(saved.logs);
      setPrices(saved.prices);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fuelAppData', JSON.stringify({ tank, remaining, logs, prices }));
  }, [tank, remaining, logs, prices]);

  const refillFuel = (type, amount) => {
    setRemaining(prev => {
      const updated = { ...prev, [type]: Math.min(tank[type], Math.max(0, prev[type] + amount)) };
      return updated;
    });
  };

  const updateTankCapacity = (type, value) => {
    setTank(prev => ({ ...prev, [type]: value }));
    setRemaining(prev => ({ ...prev, [type]: Math.min(prev[type], value) }));
  };

  const updatePrice = (type, value) => {
    setPrices(prev => ({ ...prev, [type]: value }));
  };

  const handleSale = (data) => {
    const { quantity, price } = data;
    if (isNaN(quantity) || quantity <= 0) return alert("Invalid quantity!");
    if (isNaN(price) || price <= 0) return alert("Invalid price!");

    const date = new Date().toISOString();
    const sale = { ...data, date };

    setLogs(prev => [...prev, sale]);
    setRemaining(prev => ({
      ...prev,
      [sale.fuelType]: Math.max(0, prev[sale.fuelType] - sale.quantity)
    }));
  };

  const todayLogs = logs.filter(log => new Date(log.date).toDateString() === new Date().toDateString());

  return (
    <div className="App p-4">
      <div className="flex gap-4 mb-4 flex-wrap">
        {(user.role !== 'user') && (
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            {language === 'hi' ? 'मेनू' : 'Menu'}
          </button>
        )}
        <button className="menu-button" onClick={() => setCatalogOpen(!catalogOpen)}>
          {language === 'hi' ? 'ग्राहक कैटलॉग' : 'Customer Catalog'}
        </button>
        <button className="menu-button" onClick={() => setSalesOpen(!salesOpen)}>
          {language === 'hi' ? 'बिक्री' : 'Sales'}
        </button>
        {(user.role !== 'user') && (
          <button className="menu-button" onClick={() => setLedgerOpen(!ledgerOpen)}>
            {language === 'hi' ? 'लेज़र' : 'Ledger'}
          </button>
        )}
        <button className="menu-button" onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}>
          {language === 'hi' ? 'English' : 'हिंदी'}
        </button>
      </div>

      {/* Today's Prices */}
      <div className="bg-gray-900 text-white p-4 rounded-xl mb-6">
        <h3 className="text-lg font-semibold text-yellow-400">
          {language === 'hi' ? 'आज के ईंधन मूल्य' : 'Today’s Fuel Prices'}
        </h3>
        <p className="text-sm text-gray-300">
          {language === 'hi' ? 'पेट्रोल:' : 'Petrol:'} ₹{prices.petrol} &nbsp; | &nbsp;
          {language === 'hi' ? 'डीज़ल:' : 'Diesel:'} ₹{prices.diesel}
        </p>
      </div>

      {/* Conditional Pages */}
      {menuOpen && user.role !== 'user' && (
        <SettingsMenu
          tank={tank}
          prices={prices}
          updateTankCapacity={updateTankCapacity}
          refillFuel={refillFuel}
          updatePrice={updatePrice}
          language={language}
        />
      )}
      {catalogOpen && <CustomerCatalog logs={logs} language={language} />}
      {salesOpen && <SalesSummary logs={logs} language={language} />}
      {ledgerOpen && user.role !== 'user' && <CustomerLedger logs={logs} language={language} />}

      {/* Tanks and Sale Form */}
      <TankStatus tank={tank} remaining={remaining} />
      <FuelSaleForm onSell={handleSale} language={language} prices={prices} />
      <SalesLog logs={todayLogs} language={language} />

      {/* Export */}
      {(user.role !== 'user') && <ExportPDF logs={logs} language={language} />}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() });
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) return null; // or loader

  return (
    <Routes>
      <Route path="/" element={<Dashboard user={user} />} />
      <Route path="/view-ledger/:customerId" element={<ViewLedger />} />
    </Routes>
  );
}
