import React from 'react';
import ReactDOM from 'react-dom/client';
import { styled } from '@mui/material';
import { Provider } from 'react-redux';
import store from './store';
import AuthProvider from './context/AuthContext';
import App from './App';

const StyledApp = styled(App)({
  '@media (max-width: 450px)': {
    '.node': {
      fontSize: '50%',
    },
  },
});

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <StyledApp />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);