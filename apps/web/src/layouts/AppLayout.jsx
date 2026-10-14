import React, { useState, useEffect, useRef } from 'react';
import Logo from '../components/ui/Logo';
import {
  Sun,
  Moon,
  Search,
  Bell,
  User,
  Settings,
  Bookmark,
  Code2,
  Trophy,
  History,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export default function AppLayout({
  children,
  currentRoute = 'dashboard',
  onRouteChange,
  theme = 'dark',
  onToggleTheme,
  user = { username: 'kanishk', name: 'Kanishk Singh', email: 'kanishk@codekro.dev' },
  onGlobalSearch,
}) {
  const isDark = theme === 'dark';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Global search keyboard shortcut ("/")
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'problems', label: 'Problems', href: '#problems' },
    { id: 'contests', label: 'Contests', href: '#contests' },
    { id: 'discuss', label: 'Discuss', href: '#discuss' },
    { id: 'leaderboard', label: 'Leaderboard', href: '#leaderboard' },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: Code2 },
    { id: 'contests', label: 'Contests', icon: Trophy },
    { id: 'submissions', label: 'Submissions', icon: History },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onGlobalSearch) {
      onGlobalSearch(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col font-sans">
      {/* 56px Top Navbar */}
      <header className="h-14 border-b border-border-default bg-bg-surface sticky top-0 z-40 select-none">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
          {/* Left section: Mobile menu toggle + Logo + Top Nav links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="md:hidden p-1.5 text-text-muted hover:text-text-primary rounded-[var(--radius-sm)] border border-border-default bg-bg-surface-subtle"
              aria-label="Toggle mobile menu"
            >
              {isMobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <a href="#dashboard" className="flex items-center focus-visible:outline-accent">
              <Logo size="md" />
            </a>

            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-text-secondary">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="hover:text-text-primary transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right section: Global Search, Notifications, Theme, User Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-44 md:w-60">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full h-8 pl-8 pr-8 text-xs bg-bg-input border border-border-default text-text-primary placeholder:text-text-muted rounded-[var(--radius-sm)] focus:border-accent focus:outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-bg-surface-subtle border border-border-default text-text-muted">
                  /
                </kbd>
              </div>
            </form>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                aria-label="View notifications"
                className="p-1.5 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                {/* Clean unread indicator dot in green */}
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent ring-2 ring-bg-surface" />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-bg-surface border border-border-default rounded-[var(--radius-md)] shadow-lg py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-border-subtle flex items-center justify-between font-medium">
                    <span>Notifications</span>
                    <span className="text-[10px] text-text-muted">2 unread</span>
                  </div>
                  <div className="divide-y divide-border-subtle max-h-60 overflow-y-auto">
                    <div className="px-3 py-2 hover:bg-bg-surface-hover cursor-pointer">
                      <p className="text-text-primary font-medium">Weekly Contest 412</p>
                      <p className="text-[11px] text-text-muted">Registration confirmed. Starts in 2 days.</p>
                    </div>
                    <div className="px-3 py-2 hover:bg-bg-surface-hover cursor-pointer">
                      <p className="text-text-primary font-medium">Daily Streak Achieved</p>
                      <p className="text-[11px] text-text-muted">14-day milestone reached! Keep it up.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface hover:bg-bg-surface-hover transition-colors cursor-pointer"
                aria-expanded={isUserMenuOpen}
              >
                <div className="w-6 h-6 rounded bg-bg-surface-subtle border border-border-default flex items-center justify-center text-[11px] font-mono font-medium text-accent">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-text-primary hidden sm:inline-block max-w-[90px] truncate">
                  {user.username}
                </span>
                <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-bg-surface border border-border-default rounded-[var(--radius-md)] shadow-lg py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-border-subtle">
                    <p className="font-semibold text-text-primary">{user.name}</p>
                    <p className="text-[11px] text-text-muted truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <a
                      href="#profile"
                      className="flex items-center gap-2 px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </a>
                    <a
                      href="#submissions"
                      className="flex items-center gap-2 px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Submissions</span>
                    </a>
                    <a
                      href="#settings"
                      className="flex items-center gap-2 px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </a>
                  </div>
                  <div className="border-t border-border-subtle pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onRouteChange) onRouteChange('auth');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-error hover:bg-bg-surface-hover text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Collapsible Sidebar & Content */}
      <div className="flex-1 max-w-[1280px] w-full mx-auto flex">
        {/* Desktop Collapsible Left Sidebar */}
        <aside
          className={`hidden md:flex flex-col border-r border-border-default bg-bg-surface transition-all duration-200 select-none ${
            isSidebarCollapsed ? 'w-14 items-center' : 'w-56'
          }`}
        >
          {/* Sidebar Collapse Toggle Button */}
          <div className="p-2 border-b border-border-subtle flex justify-end w-full">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-surface-hover cursor-pointer"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-1 w-full">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onRouteChange && onRouteChange(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--radius-sm)] text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-bg-surface-subtle text-accent border border-accent/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover border border-transparent'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : ''}`} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Drawer (Accessible when menu toggled) */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-64 bg-bg-surface border-r border-border-default h-full flex flex-col p-4 shadow-xl z-10">
              <div className="flex items-center justify-between pb-4 border-b border-border-default mb-4">
                <Logo size="md" />
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        if (onRouteChange) onRouteChange(item.id);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] text-xs font-medium transition-colors text-left ${
                        isActive
                          ? 'bg-bg-surface-subtle text-accent border border-accent/20'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto pt-4 border-t border-border-subtle text-xs text-text-muted">
                <p>© 2026 CodeKro</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
