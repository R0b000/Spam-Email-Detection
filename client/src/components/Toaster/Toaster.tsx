import React, { useState, createContext, useContext, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface Toast {
  id: number;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextValue {
  showToast: (message: string, severity?: Toast['severity']) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const Toaster: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, severity: Toast['severity'] = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, severity }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert severity={toast.severity} variant="filled" className="min-w-[280px]">
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default Toaster;
