import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Briefcase, 
  FileText, 
  Brain, 
  TrendingUp,
  User,
  Bell,
  BarChart3,
  Calendar as CalendarIcon,
  LogOut
} from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: TrendingUp },
    { path: '/tracker', label: 'Applications', icon: Briefcase },
    { path: '/interview', label: 'Interview Prep', icon: Brain },
    { path: '/reminders', label: 'Reminders', icon: Bell },
    { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-effect rounded-2xl p-4 mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">AI Application Tracker</h1>
        </div>

        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-4">
          {/* User Info */}
          {currentUser && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white text-sm font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-white/60 text-xs">
                  {currentUser.email}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          
          {/* Theme Switcher */}
          <ThemeSwitcher />
          
          {/* Signout Button */}
          {currentUser && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
