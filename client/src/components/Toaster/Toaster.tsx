import React, { useState, createContext, useContext, useCallback } from 'react';
import { Snackbar, Box, CircularProgress, Typography } from '@mui/material';

interface ToastContextValue {
  showProgressToast: (message: string) => void;
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'info' | 'success' | 'error'>('info');
  const [isProgress, setIsProgress] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const clearExistingTimeout = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const showProgressToast = useCallback((msg: string) => {
    clearExistingTimeout();
    setMessage(msg);
    setSeverity('info');
    setIsProgress(true);
    setOpen(true);
  }, [clearExistingTimeout]);

  const showSuccessToast = useCallback((msg: string) => {
    clearExistingTimeout();
    setMessage(msg);
    setSeverity('success');
    setIsProgress(false);
    setOpen(true);
    
    const id = setTimeout(() => {
      setOpen(false);
    }, 4000);
    setTimeoutId(id);
  }, [clearExistingTimeout]);

  const showErrorToast = useCallback((msg: string) => {
    clearExistingTimeout();
    setMessage(msg);
    setSeverity('error');
    setIsProgress(false);
    setOpen(true);

    const id = setTimeout(() => {
      setOpen(false);
    }, 5000);
    setTimeoutId(id);
  }, [clearExistingTimeout]);

  const hideToast = useCallback(() => {
    clearExistingTimeout();
    setOpen(false);
  }, [clearExistingTimeout]);

  return (
    <ToastContext.Provider value={{ showProgressToast, showSuccessToast, showErrorToast, hideToast }}>
      {children}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={isProgress ? undefined : () => setOpen(false)}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: severity === 'error' ? '#d32f2f' : '#5f6368',
            color: '#fff',
            px: 2.5,
            py: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: 280,
          }}
        >
          {isProgress && (
            <CircularProgress size={16} sx={{ color: '#fff' }} />
          )}
          <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1, letterSpacing: '0.2px' }}>
            {message}
          </Typography>
        </Box>
      </Snackbar>
    </ToastContext.Provider>
  );
};
