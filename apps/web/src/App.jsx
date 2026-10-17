import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import AuthCard from './features/auth/AuthCard';
import DashboardView from './features/dashboard/DashboardView';
import ProblemWorkspace from './features/problem/ProblemWorkspace';

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
  const parseCurrentLocation = () => {
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Route: /problems/:slug
    if (pathname.startsWith('/problems/')) {
      const slug = pathname.replace('/problems/', '').replace(/\/$/, '') || 'two-sum';
      return { route: 'problem', slug, tab: 'login' };
    }

    // Route: /dashboard
    if (pathname === '/dashboard') {
      return { route: 'dashboard', slug: 'two-sum', tab: 'login' };
    }

    // Default: / redirects to auth (login/register)
    const tab = pathname === '/register' || params.get('tab') === 'register' ? 'register' : 'login';
    return { route: 'auth', slug: 'two-sum', tab };
  };

  const getInitialTheme = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('theme') === 'light' ? 'light' : 'dark';
  };

  const initial = parseCurrentLocation();
  const [currentRoute, setCurrentRoute] = useState(initial.route);
  const [problemSlug, setProblemSlug] = useState(initial.slug);
  const [activeAuthTab, setActiveAuthTab] = useState(initial.tab);
  const [theme, setTheme] = useState(getInitialTheme);

  // Sync theme with data-theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Ensure root URL / visually redirects to /login
  useEffect(() => {
    if (window.location.pathname === '/') {
      window.history.replaceState(null, '', '/login');
    }
  }, []);

  // Handle browser back/forward route changes
  useEffect(() => {
    const handlePopState = () => {
      const loc = parseCurrentLocation();
      setCurrentRoute(loc.route);
      setProblemSlug(loc.slug);
      setActiveAuthTab(loc.tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    const loc = parseCurrentLocation();
    setCurrentRoute(loc.route);
    setProblemSlug(loc.slug);
    setActiveAuthTab(loc.tab);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {/* 1. Problem Workspace Route: /problems/:slug */}
      {currentRoute === 'problem' && (
        <ProblemWorkspace
          slug={problemSlug}
          onBackToList={() => navigateTo('/dashboard')}
          onNavigateSlug={(newSlug) => navigateTo(`/problems/${newSlug}`)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* 2. Dashboard Route: /dashboard */}
      {currentRoute === 'dashboard' && (
        <AppLayout
          currentRoute="dashboard"
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              navigateTo('/login');
            } else {
              navigateTo('/dashboard');
            }
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        >
          <DashboardView
            onNavigateProblem={(problem) => {
              const slug = problem.titleSlug || 'two-sum';
              navigateTo(`/problems/${slug}`);
            }}
          />
        </AppLayout>
      )}

      {/* 3. Auth Route: /login, /register, and root / */}
      {currentRoute === 'auth' && (
        <AuthLayout theme={theme} onToggleTheme={toggleTheme}>
          <AuthCard
            activeTab={activeAuthTab}
            onTabChange={(tab) => {
              setActiveAuthTab(tab);
              window.history.replaceState(null, '', tab === 'register' ? '/register' : '/login');
            }}
            onSuccess={() => navigateTo('/dashboard')}
          />
        </AuthLayout>
      )}
    </QueryClientProvider>
  );
}
