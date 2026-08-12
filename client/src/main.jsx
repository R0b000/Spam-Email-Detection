import React from 'react';
import ReactDOM from 'react-dom/client';
import { styled } from '@mui/material';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

const StyledApp = styled(App)({
  '@media (max-width: 450px)': {
    '.node': {
      fontSize: '50%',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledApp />
    </Provider>
  </React.StrictMode>
);
