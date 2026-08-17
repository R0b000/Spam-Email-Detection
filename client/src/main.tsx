import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthProvider from './context/AuthContext';
import { ToastProvider } from './components/Toaster/Toaster';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);