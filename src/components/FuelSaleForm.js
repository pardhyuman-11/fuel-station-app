import React, { useState } from 'react';

export default function FuelSaleForm({ onSell, language, prices }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    fuelType: 'petrol',
    quantity: '',
    customPrice: '',
    status: 'Paid',
    note: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData(prev => ({ ...prev, file: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert(language === 'hi' ? 'कृपया मान्य मात्रा दर्ज करें।' : 'Please enter a valid quantity.');
      return;
    }

    const price = formData.customPrice !== ''
      ? parseFloat(formData.customPrice)
      : prices[formData.fuelType];

    const reader = new FileReader();
    reader.onloadend = () => {
      onSell({
        name: formData.name || 'Unknown',
        phone: formData.phone || '',
        fuelType: formData.fuelType,
        quantity,
        price,
        status: formData.status,
        note: formData.note,
        file: formData.file ? { name: formData.file.name, data: reader.result } : null
      });

      setFormData({
        name: '',
        phone: '',
        fuelType: 'petrol',
        quantity: '',
        customPrice: '',
        status: 'Paid',
        note: '',
        file: null
      });
    };

    if (formData.file) {
      reader.readAsDataURL(formData.file);
    } else {
      reader.onloadend(); // Trigger without reading file
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#222] text-white p-4 rounded-xl mt-6 mb-6 max-w-xl mx-auto shadow-lg">
      <h2 className="text-lg font-semibold mb-4">
        {language === 'hi' ? 'ईंधन बिक्री' : 'Fuel Sale'}
      </h2>

      <input
        type="text"
        name="name"
        placeholder={language === 'hi' ? 'ग्राहक का नाम (वैकल्पिक)' : 'Customer Name (optional)'}
        value={formData.name}
        onChange={handleChange}
        className="form-input"
      />

      <input
        type="text"
        name="phone"
        placeholder={language === 'hi' ? 'फ़ोन नंबर (वैकल्पिक)' : 'Phone Number (optional)'}
        value={formData.phone}
        onChange={handleChange}
        className="form-input"
      />

      <select
        name="fuelType"
        value={formData.fuelType}
        onChange={handleChange}
        className="form-input"
      >
        <option value="petrol">{language === 'hi' ? 'पेट्रोल' : 'Petrol'}</option>
        <option value="diesel">{language === 'hi' ? 'डीज़ल' : 'Diesel'}</option>
      </select>

      <input
        type="number"
        name="quantity"
        placeholder={language === 'hi' ? 'मात्रा (लीटर)' : 'Quantity (litres)'}
        value={formData.quantity}
        onChange={handleChange}
        className="form-input"
        required
      />

      <input
        type="number"
        name="customPrice"
        placeholder={language === 'hi' ? 'मूल्य (₹) - वैकल्पिक' : 'Custom Price (₹) - Optional'}
        value={formData.customPrice}
        onChange={handleChange}
        className="form-input"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="form-input"
      >
        <option value="Paid">{language === 'hi' ? 'भुगतान किया गया' : 'Paid'}</option>
        <option value="Due">{language === 'hi' ? 'बकाया' : 'Due'}</option>
      </select>

      <textarea
        name="note"
        placeholder={language === 'hi' ? 'टिप्पणी (वैकल्पिक)' : 'Comment/Note (optional)'}
        value={formData.note}
        onChange={handleChange}
        className="form-input"
        rows={3}
      />

      <input
        type="file"
        name="file"
        onChange={handleChange}
        className="form-input text-white"
        accept="image/*,.pdf"
      />

      <button type="submit" className="menu-button mt-4">
        {language === 'hi' ? 'बिक्री दर्ज करें' : 'Submit Sale'}
      </button>
    </form>
  );
}
