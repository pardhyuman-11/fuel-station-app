import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './pages/Login';
import ViewLedger from './pages/ViewLedger';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRoute from './routes/PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <App />
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
