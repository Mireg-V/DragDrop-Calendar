import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CalendarProvider from './class/Calendar';
import LanguageProvider from './modules/language/Lang';
import Header from './modules/header/Header.jsx'
import Main from './modules/main/Main.jsx'

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <LanguageProvider>
    <CalendarProvider>
      <Header />
      <Main />
    </CalendarProvider>
  </LanguageProvider>
);
