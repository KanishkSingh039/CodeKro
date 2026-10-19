import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import AuthCard from './features/auth/AuthCard';
import DashboardView from './features/dashboard/DashboardView';
import ProblemWorkspace from './features/problem/ProblemWorkspace';
import ProfileView from './features/profile/ProfileView';
import SettingsView from './features/profile/SettingsView';
import LandingView from './features/landing/LandingView';

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
  const getInitialTheme = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('theme')) {
      return params.get('theme') === 'light' ? 'light' : 'dark';
    }
    const saved = localStorage.getItem('codekro_theme');
    if (saved) return saved;
    return 'dark'; // Dark by default as required
  };

  const parseCurrentLocation = () => {
    const pathname = window.location.pathname;
    const isAuthed = localStorage.getItem('codekro_auth') === 'true';

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

    // Route: /problems (list)
    if (pathname === '/problems') {
      return { route: 'dashboard', username: 'kanishk', slug: 'two-sum', tab: 'login', settingsTab: 'profile' };
    }

    // Route: /dashboard
    if (pathname === '/dashboard') {
      return { route: 'dashboard', username: 'kanishk', slug: 'two-sum', tab: 'login', settingsTab: 'profile' };
    }

    // Route: /login or /register
    if (pathname === '/login' || pathname === '/register') {
      return {
        route: 'auth',
        username: 'kanishk',
        slug: 'two-sum',
        tab: pathname === '/register' ? 'register' : 'login',
        settingsTab: 'profile',
      };
    }

    // Route: / (root)
    // If signed-in: redirect to /dashboard
    // If signed-out: landing page
    if (pathname === '/' || pathname === '') {
      if (isAuthed) {
        return { route: 'dashboard', username: 'kanishk', slug: 'two-sum', tab: 'login', settingsTab: 'profile' };
      }
      return { route: 'landing', username: 'kanishk', slug: 'two-sum', tab: 'login', settingsTab: 'profile' };
    }

    // Fallback for unknown routes
    return { route: 'landing', username: 'kanishk', slug: 'two-sum', tab: 'login', settingsTab: 'profile' };
  };

  const initial = parseCurrentLocation();
  const [currentRoute, setCurrentRoute] = useState(initial.route);
  const [targetUsername, setTargetUsername] = useState(initial.username || 'kanishk');
  const [problemSlug, setProblemSlug] = useState(initial.slug);
  const [activeAuthTab, setActiveAuthTab] = useState(initial.tab);
  const [settingsTab, setSettingsTab] = useState(initial.settingsTab || 'profile');
  const [theme, setTheme] = useState(getInitialTheme);

  // Sync theme with data-theme attribute on root element & persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('codekro_theme', theme);
    } catch {
      // Ignore in restricted environments
    }
  }, [theme]);

  // Sync URL for signed-in root visits
  useEffect(() => {
    const isAuthed = localStorage.getItem('codekro_auth') === 'true';
    if (window.location.pathname === '/' && isAuthed) {
      window.history.replaceState(null, '', '/dashboard');
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
      {/* 1. Public Landing Page Route: / (signed-out visitors) */}
      {currentRoute === 'landing' && (
        <LandingView
          onNavigate={(target) => {
            if (target === 'login') navigateTo('/login');
            else if (target === 'register') navigateTo('/register');
            else if (target === 'problems') navigateTo('/problems');
            else if (target === 'dashboard') navigateTo('/dashboard');
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* 2. Problem Workspace Route: /problems/:slug */}
      {currentRoute === 'problem' && (
        <ProblemWorkspace
          slug={problemSlug}
          onBackToList={() => navigateTo('/dashboard')}
          onNavigateSlug={(newSlug) => navigateTo(`/problems/${newSlug}`)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* 3. Public / Owner Profile Route: /u/:username */}
      {currentRoute === 'profile' && (
        <AppLayout
          currentRoute="profile"
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              localStorage.removeItem('codekro_auth');
              navigateTo('/');
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

      {/* 4. Settings Route: /settings/profile */}
      {currentRoute === 'settings' && (
        <AppLayout
          currentRoute="settings"
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              localStorage.removeItem('codekro_auth');
              navigateTo('/');
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
            onAccountDeleted={() => {
              localStorage.removeItem('codekro_auth');
              navigateTo('/');
            }}
          />
        </AppLayout>
      )}

      {/* 5. Dashboard Route: /dashboard */}
      {currentRoute === 'dashboard' && (
        <AppLayout
          currentRoute="dashboard"
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              localStorage.removeItem('codekro_auth');
              navigateTo('/');
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

      {/* 6. Auth Route: /login and /register */}
      {currentRoute === 'auth' && (
        <AuthLayout theme={theme} onToggleTheme={toggleTheme}>
          <AuthCard
            activeTab={activeAuthTab}
            onTabChange={(tab) => {
              setActiveAuthTab(tab);
              window.history.replaceState(null, '', tab === 'register' ? '/register' : '/login');
            }}
            onSuccess={() => {
              localStorage.setItem('codekro_auth', 'true');
              navigateTo('/dashboard');
            }}
          />
        </AuthLayout>
      )}
    </QueryClientProvider>
  );
}
