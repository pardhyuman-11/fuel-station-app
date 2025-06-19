import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function CustomerCatalog({ language }) {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'customers'));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(list);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {language === 'hi' ? 'ग्राहक सूची' : 'Customer Catalog'}
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">
                {language === 'hi' ? 'नाम' : 'Name'}
              </th>
              <th className="px-4 py-2 text-left">
                {language === 'hi' ? 'फोन नंबर' : 'Phone'}
              </th>
              <th className="px-4 py-2 text-left">
                {language === 'hi' ? 'जुड़ने की तिथि' : 'Joined On'}
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr
                key={c.id}
                className="border-t cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/ledger/${c.id}`)}
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{c.name || '-'}</td>
                <td className="px-4 py-2">{c.phone || '-'}</td>
                <td className="px-4 py-2">
                  {c.createdAt?.toDate?.().toLocaleDateString() || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← {language === 'hi' ? 'डैशबोर्ड पर लौटें' : 'Back to Dashboard'}
      </button>
    </div>
  );
}
