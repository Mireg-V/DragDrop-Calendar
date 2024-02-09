import React from 'react';
import { useLanguage } from './Lang';
import './Language.css';

function Language() {
  const { language, setLanguage } = useLanguage();

  const availableLanguages = ['us', 'ua'];

  return (
    <div className="language">
      {availableLanguages.map((langCode) => (
        <img
          src={`https://cdn.impactium.fun/langs/${langCode}.png`}
          alt={`Language ${langCode}`}
          className={langCode === language ? 'active' : ''}
          onClick={() => setLanguage(langCode)}
          key={langCode}
        />
      ))}
    </div>
  );
}

export default Language;
