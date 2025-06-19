import React from 'react';

export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div style={{ display: 'inline-block', marginLeft: '1rem' }}>
      <label>
        🌐 {language === 'hi' ? 'भाषा' : 'Language'}:
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </label>
    </div>
  );
}
