import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import en from '@shopify/polaris/locales/en.json';

// Import pages
import Dashboard from './pages/Dashboard';
import WidgetSettings from './pages/WidgetSettings';

// Import styles
import './styles/App.css';

// App Bridge configuration
const appBridgeConfig = {
  apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
  host: new URLSearchParams(window.location.search).get('host') || window.location.origin,
  forceRedirect: true,
};

function App() {
  return (
    <Provider config={appBridgeConfig}>
      <AppProvider i18n={en}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<WidgetSettings />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </Provider>
  );
}

export default App; 