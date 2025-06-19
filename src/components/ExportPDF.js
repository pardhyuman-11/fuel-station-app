import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportPDF({ logs, language }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(language === 'hi' ? 'ईंधन बिक्री रिपोर्ट' : 'Fuel Sales Report', 14, 16);

    const columns = [
      language === 'hi' ? 'तारीख' : 'Date',
      language === 'hi' ? 'ग्राहक' : 'Customer',
      language === 'hi' ? 'फ़ोन' : 'Phone',
      language === 'hi' ? 'ईंधन प्रकार' : 'Fuel Type',
      language === 'hi' ? 'मात्रा (L)' : 'Quantity (L)',
      language === 'hi' ? 'मूल्य (₹)' : 'Price (₹)',
      language === 'hi' ? 'स्थिति' : 'Status',
    ];

    const rows = logs.map(log => [
      new Date(log.date).toLocaleString(),
      log.name || 'Unknown',
      log.phone || '-',
      log.fuelType,
      log.quantity,
      log.price,
      log.status || 'Paid',
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 24,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }
    });

    doc.save('fuel_sales_report.pdf');
  };

  return (
    <div className="text-center mb-8">
      <button className="menu-button" onClick={generatePDF}>
        {language === 'hi' ? 'PDF निर्यात करें' : 'Export to PDF'}
      </button>
    </div>
  );
}
