import React from 'react';
import './index.css';
import App from './app/App';
import {Provider} from 'react-redux';
import store from './app/store';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
