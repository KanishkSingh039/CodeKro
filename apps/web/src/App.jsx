import React, { useState, useEffect } from 'react';
import AuthLayout from './layouts/AuthLayout';
import AuthCard from './features/auth/AuthCard';

export default function App() {
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') === 'register' ? 'register' : 'login';
  };

  const getInitialTheme = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('theme') === 'light' ? 'light' : 'dark';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [theme, setTheme] = useState(getInitialTheme);

  // Sync theme with data-theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AuthLayout theme={theme} onToggleTheme={toggleTheme}>
      <AuthCard activeTab={activeTab} onTabChange={setActiveTab} />
    </AuthLayout>
  );
}
