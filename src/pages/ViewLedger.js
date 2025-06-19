import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export default function ViewLedger() {
  const { customerId } = useParams();
  const [logs, setLogs] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    fetchCustomerLedger();
  }, [customerId]);

  const fetchCustomerLedger = async () => {
    try {
      const customerSnap = await getDocs(
        query(collection(db, 'customers'), where('__name__', '==', customerId))
      );
      const customerData = customerSnap.docs[0]?.data();
      setCustomer(customerData || null);

      const salesSnap = await getDocs(
        query(collection(db, 'sales'), where('customerId', '==', customerId))
      );
      const salesList = salesSnap.docs.map(doc => doc.data());
      setLogs(salesList.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Error loading ledger:", error);
    }
  };

  const handlePayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter a valid amount');
      return;
    }

    try {
      await addDoc(collection(db, 'sales'), {
        customerId,
        payment: amount,
        type: 'payment',
        comment: 'Manual payment entry',
        date: new Date().toISOString(),
        createdAt: Timestamp.now()
      });
      setPaymentAmount('');
      fetchCustomerLedger(); // refresh ledger
    } catch (error) {
      console.error("Failed to save payment:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Ledger for {customer?.name || 'Customer'}
      </h2>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          placeholder="Enter amount received"
          className="border px-4 py-2 rounded w-60"
        />
        <button
          onClick={handlePayment}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Receive Payment
        </button>
      </div>

      {logs.length === 0 ? (
        <p>No records yet for this customer.</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-300 bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Liters</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Comment</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{new Date(log.date).toLocaleString()}</td>
                <td className="px-4 py-2">
                  {log.type === 'payment' ? '💰 Payment' : log.fuelType}
                </td>
                <td className="px-4 py-2">{log.quantity || '-'}</td>
                <td className="px-4 py-2">
                  ₹{log.payment || log.price || 0}
                </td>
                <td className="px-4 py-2">{log.status || '-'}</td>
                <td className="px-4 py-2">{log.comment || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link
        to="/catalog"
        className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Back to Customer Catalog
      </Link>
    </div>
  );
}
