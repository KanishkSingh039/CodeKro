import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import AuthCard from './features/auth/AuthCard';
import DashboardView from './features/dashboard/DashboardView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const getInitialRoute = () => {
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    if (pathname === '/login' || pathname === '/register' || params.get('route') === 'auth') {
      return 'auth';
    }
    // Route: /dashboard is the default landing page after auth
    return 'dashboard';
  };

  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;
    if (pathname === '/register' || params.get('tab') === 'register') {
      return 'register';
    }
    return 'login';
  };

  const getInitialTheme = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('theme') === 'light' ? 'light' : 'dark';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [theme, setTheme] = useState(getInitialTheme);

  // Sync theme with data-theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle browser back/forward route changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navigateTo = (route) => {
    setCurrentRoute(route);
    const targetPath = route === 'auth' ? '/login' : '/dashboard';
    window.history.pushState(null, '', targetPath);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {currentRoute === 'dashboard' ? (
        <AppLayout
          currentRoute="dashboard"
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              navigateTo('auth');
            } else {
              navigateTo('dashboard');
            }
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        >
          <DashboardView
            onNavigateProblem={(problem) => {
              console.info('Navigate to problem solver:', problem);
            }}
          />
        </AppLayout>
      ) : (
        <AuthLayout theme={theme} onToggleTheme={toggleTheme}>
          <AuthCard
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSuccess={() => navigateTo('dashboard')}
          />
        </AuthLayout>
      )}
    </QueryClientProvider>
  );
}
