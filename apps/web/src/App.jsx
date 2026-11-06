import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiClient, getAuthUser } from './lib/api';
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
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const decodePathSegment = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export default function App() {
  const getInitialTheme = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('theme')) {
      return params.get('theme') === 'light' ? 'light' : 'dark';
    }
    try {
      const saved = localStorage.getItem('codekro_theme');
      if (saved) return saved;
    } catch {
      // Ignore in restricted environments.
    }
    return 'dark';
  };

  const parseCurrentLocation = () => {
    const pathname = window.location.pathname;
    const authUser = getAuthUser();
    const isAuthed = Boolean(authUser?.id);
    const username = authUser?.username || '';

    if (pathname.startsWith('/u/')) {
      const encodedUsername = pathname.replace('/u/', '').replace(/\/$/, '');
      const routeUsername = decodePathSegment(encodedUsername) || username;
      return { route: 'profile', username: routeUsername, slug: '', tab: 'login', settingsTab: 'profile' };
    }

    if (pathname.startsWith('/settings')) {
      const parts = pathname.split('/').filter(Boolean);
      const settingsTab = parts[1] || 'profile';
      return { route: 'settings', username, slug: '', tab: 'login', settingsTab };
    }

    if (pathname.startsWith('/problems/')) {
      const slug = pathname.replace('/problems/', '').replace(/\/$/, '');
      return { route: 'problem', username, slug, tab: 'login', settingsTab: 'profile' };
    }

    if (pathname === '/problems' || pathname === '/dashboard') {
      return { route: 'dashboard', username, slug: '', tab: 'login', settingsTab: 'profile' };
    }

    if (pathname === '/login' || pathname === '/register') {
      return {
        route: 'auth',
        username,
        slug: '',
        tab: pathname === '/register' ? 'register' : 'login',
        settingsTab: 'profile',
      };
    }

    if (pathname === '/' || pathname === '') {
      return {
        route: isAuthed ? 'dashboard' : 'landing',
        username,
        slug: '',
        tab: 'login',
        settingsTab: 'profile',
      };
    }

    return { route: 'landing', username, slug: '', tab: 'login', settingsTab: 'profile' };
  };

  const initial = parseCurrentLocation();
  const initialRoute = useRef(initial.route);
  const [currentRoute, setCurrentRoute] = useState(initial.route);
  const [sessionUser, setSessionUser] = useState(() => getAuthUser());
  const [targetUsername, setTargetUsername] = useState(
    initial.username || getAuthUser()?.username || ''
  );
  const [problemSlug, setProblemSlug] = useState(initial.slug);
  const [activeAuthTab, setActiveAuthTab] = useState(initial.tab);
  const [settingsTab, setSettingsTab] = useState(initial.settingsTab || 'profile');
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('codekro_theme', theme);
    } catch {
      // Ignore in restricted environments.
    }
  }, [theme]);

  useEffect(() => {
    const authUser = getAuthUser();
    if (window.location.pathname === '/' && authUser?.id) {
      window.history.replaceState(null, '', '/dashboard');
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const loc = parseCurrentLocation();
      setCurrentRoute(loc.route);
      setTargetUsername(loc.username || getAuthUser()?.username || '');
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

  const navigateTo = (requestedPath) => {
    const requestedRoute = requestedPath.split(/[?#]/)[0];
    const isProtectedRoute =
      requestedRoute === '/dashboard' ||
      requestedRoute === '/problems' ||
      requestedRoute.startsWith('/problems/') ||
      requestedRoute.startsWith('/settings') ||
      requestedRoute.startsWith('/u/');
    const hasSession = Boolean(sessionUser?.id || getAuthUser()?.id);
    let path = requestedPath;

    if (!hasSession && isProtectedRoute) path = '/login';
    if (hasSession && (requestedRoute === '/login' || requestedRoute === '/register')) {
      path = '/dashboard';
    }

    window.history.pushState(null, '', path);
    const loc = parseCurrentLocation();
    setCurrentRoute(loc.route);
    setTargetUsername(loc.username || getAuthUser()?.username || '');
    setProblemSlug(loc.slug);
    setActiveAuthTab(loc.tab);
    setSettingsTab(loc.settingsTab || 'profile');
  };

  const profilePath = () =>
    sessionUser?.username ? `/u/${encodeURIComponent(sessionUser.username)}` : '/login';

  const handleLogout = async () => {
    await apiClient.logout();
    setSessionUser(null);
    queryClient.clear();
    navigateTo('/');
  };

  useEffect(() => {
    let active = true;

    apiClient.hydrateSession().then((user) => {
      if (!active) return;

      setSessionUser(user);

      if (!user) {
        if (['dashboard', 'profile', 'settings', 'problem'].includes(initialRoute.current)) {
          window.history.replaceState(null, '', '/login');
          setCurrentRoute('auth');
          setActiveAuthTab('login');
        }
        return;
      }

      if (window.location.pathname === '/' || window.location.pathname === '') {
        window.history.replaceState(null, '', '/dashboard');
        setCurrentRoute('dashboard');
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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

      {currentRoute === 'problem' && (
        <ProblemWorkspace
          slug={problemSlug}
          user={sessionUser}
          onBackToList={() => navigateTo('/dashboard')}
          onNavigateSlug={(newSlug) => navigateTo(`/problems/${newSlug}`)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {currentRoute === 'profile' && (
        <AppLayout
          currentRoute="profile"
          user={sessionUser}
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              void handleLogout();
            } else if (dest === 'settings') {
              navigateTo('/settings/profile');
            } else if (dest === 'profile') {
              navigateTo(profilePath());
            } else {
              navigateTo('/dashboard');
            }
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        >
          <ProfileView
            username={targetUsername || sessionUser?.username || ''}
            onNavigateSettings={() => navigateTo('/settings/profile')}
            onNavigateProblem={(slug) => navigateTo(`/problems/${slug}`)}
            onBackToDashboard={() => navigateTo('/dashboard')}
          />
        </AppLayout>
      )}

      {currentRoute === 'settings' && (
        <AppLayout
          currentRoute="settings"
          user={sessionUser}
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              void handleLogout();
            } else if (dest === 'profile') {
              navigateTo(profilePath());
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
            user={sessionUser}
            initialTab={settingsTab}
            onBackToProfile={() => navigateTo(profilePath())}
            onAccountDeleted={() => {
              void handleLogout();
            }}
          />
        </AppLayout>
      )}

      {currentRoute === 'dashboard' && (
        <AppLayout
          currentRoute="dashboard"
          user={sessionUser}
          onRouteChange={(dest) => {
            if (dest === 'auth') {
              void handleLogout();
            } else if (dest === 'profile') {
              navigateTo(profilePath());
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
              if (!problem?.titleSlug) return;
              navigateTo(`/problems/${encodeURIComponent(problem.titleSlug)}`);
            }}
          />
        </AppLayout>
      )}

      {currentRoute === 'auth' && (
        <AuthLayout theme={theme} onToggleTheme={toggleTheme}>
          <AuthCard
            activeTab={activeAuthTab}
            onTabChange={(tab) => {
              setActiveAuthTab(tab);
              window.history.replaceState(null, '', tab === 'register' ? '/register' : '/login');
            }}
            onSuccess={async () => {
              const user = await apiClient.hydrateSession();
              setSessionUser(user);
              queryClient.clear();
              navigateTo(user ? '/dashboard' : '/login');
            }}
          />
        </AuthLayout>
      )}
    </QueryClientProvider>
  );
}
