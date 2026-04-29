import React from 'react';
import ReactDOM from 'react-dom/client';

import { AuthProvider } from './context/AuthContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import Root from './Root.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProgressProvider>
        <Root />
      </ProgressProvider>
    </AuthProvider>
  </React.StrictMode>,
);
