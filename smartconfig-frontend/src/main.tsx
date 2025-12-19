import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useConfigStore } from '@/store/config.store';

// Detectar idioma del navegador y establecerlo
const initializeLanguage = () => {
  const browserLang = navigator.language.toLowerCase();
  const isSpanish = browserLang.startsWith('es');
  const defaultLang = isSpanish ? 'es' : 'en';

  // Establece el idioma en el store
  useConfigStore.setState({ language: defaultLang });
};

// Inicializar idioma antes de renderizar
initializeLanguage();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
