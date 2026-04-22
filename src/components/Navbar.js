import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  Briefcase,
  Brain,
  TrendingUp,
  User,
  Bell,
  BarChart3,
  Calendar as CalendarIcon,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: TrendingUp },
    { path: '/tracker', label: 'Applications', icon: Briefcase },
    { path: '/interview', label: 'Interview Prep', icon: Brain },
    { path: '/reminders', label: 'Reminders', icon: Bell },
    { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleNavClick = () => setMobileOpen(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-effect rounded-2xl p-4 mb-8 border border-white/10 shadow-2xl"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg"
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent leading-tight">
              AI Application Tracker
            </h1>
            <p className="text-white/50 text-xs">Your intelligent career companion</p>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border border-primary-500/30 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="w-1 h-1 bg-primary-400 rounded-full"
                      initial={false}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          {/* User info (desktop) */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-right">
                <p className="text-white text-sm font-medium leading-tight">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-white/50 text-xs truncate max-w-28">
                  {currentUser.email}
                </p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Sign out (desktop) */}
          {currentUser && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="hidden md:flex bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-xl items-center space-x-2 border border-red-500/30 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </motion.button>
          )}

          {/* Hamburger (mobile) */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="pt-4 pb-1 border-t border-white/10 mt-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={handleNavClick}>
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-primary-500/20 text-white border border-primary-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}

              {currentUser && (
                <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium leading-tight">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-white/50 text-xs">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-xl border border-red-500/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
