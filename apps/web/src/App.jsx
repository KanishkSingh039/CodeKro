import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import AuthCard from './features/auth/AuthCard';
import DashboardView from './features/dashboard/DashboardView';
import ProblemWorkspace from './features/problem/ProblemWorkspace';
import ProfileView from './features/profile/ProfileView';
import SettingsView from './features/profile/SettingsView';

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

    // Route: /u/:username
    if (pathname.startsWith('/u/')) {
      const username = pathname.replace('/u/', '').replace(/\/$/, '') || 'kanishk';
      return { route: 'profile', username, slug: 'two-sum', tab: 'login', settingsTab: 'profile' };
    }

    // Route: /settings/:tab
    if (pathname.startsWith('/settings')) {
      const parts = pathname.split('/').filter(Boolean);
      const settingsTab = parts[1] || 'profile';
      return { route: 'settings', username: 'kanishk', slug: 'two-sum', tab: 'login', settingsTab };
    }

    // Route: /problems/:slug
    if (pathname.startsWith('/problems/')) {
      const slug = pathname.replace('/problems/', '').replace(/\/$/, '') || 'two-sum';
      return { route: 'problem', username: 'kanishk', slug, tab: 'login', settingsTab: 'profile' };
    }

    // Route: /dashboard
    if (pathname === '/dashboard') {
      return { route: 'dashboard', username: 'kanishk', slug: 'two-sum', tab: 'login', settingsTab: 'profile' };
    }

    // Default: / redirects to auth (login/register)
    const tab = pathname === '/register' || params.get('tab') === 'register' ? 'register' : 'login';
    return { route: 'auth', username: 'kanishk', slug: 'two-sum', tab, settingsTab: 'profile' };
  };

  const getInitialTheme = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('theme') === 'light' ? 'light' : 'dark';
  };

  const initial = parseCurrentLocation();
  const [currentRoute, setCurrentRoute] = useState(initial.route);
  const [targetUsername, setTargetUsername] = useState(initial.username || 'kanishk');
  const [problemSlug, setProblemSlug] = useState(initial.slug);
  const [activeAuthTab, setActiveAuthTab] = useState(initial.tab);
  const [settingsTab, setSettingsTab] = useState(initial.settingsTab || 'profile');
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
      setTargetUsername(loc.username || 'kanishk');
      setProblemSlug(loc.slug);
      setActiveAuthTab(loc.tab);
      setSettingsTab(loc.settingsTab || 'profile');
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
    setTargetUsername(loc.username || 'kanishk');
    setProblemSlug(loc.slug);
    setActiveAuthTab(loc.tab);
    setSettingsTab(loc.settingsTab || 'profile');
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

      {/* 2. Public / Owner Profile Route: /u/:username */}
      {currentRoute === 'profile' && (
        <AppLayout
          currentRoute="profile"
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              navigateTo('/login');
            } else if (dest === 'settings') {
              navigateTo('/settings/profile');
            } else if (dest === 'profile') {
              navigateTo('/u/kanishk');
            } else {
              navigateTo('/dashboard');
            }
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        >
          <ProfileView
            username={targetUsername}
            onNavigateSettings={() => navigateTo('/settings/profile')}
            onNavigateProblem={(slug) => navigateTo(`/problems/${slug}`)}
            onBackToDashboard={() => navigateTo('/dashboard')}
          />
        </AppLayout>
      )}

      {/* 3. Settings Route: /settings/profile */}
      {currentRoute === 'settings' && (
        <AppLayout
          currentRoute="settings"
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              navigateTo('/login');
            } else if (dest === 'profile') {
              navigateTo('/u/kanishk');
            } else if (dest === 'settings') {
              navigateTo('/settings/profile');
            } else {
              navigateTo('/dashboard');
            }
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        >
          <SettingsView
            initialTab={settingsTab}
            onBackToProfile={() => navigateTo('/u/kanishk')}
            onAccountDeleted={() => navigateTo('/login')}
          />
        </AppLayout>
      )}

      {/* 4. Dashboard Route: /dashboard */}
      {currentRoute === 'dashboard' && (
        <AppLayout
          currentRoute="dashboard"
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              navigateTo('/login');
            } else if (dest === 'profile') {
              navigateTo('/u/kanishk');
            } else if (dest === 'settings') {
              navigateTo('/settings/profile');
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

      {/* 5. Auth Route: /login, /register, and root / */}
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

