import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';

// Import pages
import Dashboard from './pages/Dashboard';
import WidgetSettings from './pages/WidgetSettings';

// Import styles
import './styles/App.css';

function App() {
  return (
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
  );
}

export default App; 