
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import fa360 from './services/fa360';

// Inicializar o motor core e auto-pilot
fa360.log("ECOSYSTEM: Inicializando Ferreira-360...");

// Backdoor Global para o utilizador Ferreira
(window as any).antigravity = () => {
  window.location.hash = '/antigravity';
};

// Listener de emergência (Shift + Alt + A)
window.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'a') {
    console.log("WARP: Iniciando sequência de emergência Antigravity...");
    (window as any).antigravity();
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

