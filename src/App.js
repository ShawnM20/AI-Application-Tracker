import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import ApplicationTracker from './components/ApplicationTracker';
import InterviewPrep from './components/InterviewPrep';
import Reminders from './components/Reminders';
import Analytics from './components/Analytics';
import CalendarView from './components/Calendar';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import { userStorage, migrateToUserSpecific, storage } from './utils/storage';

function AppContent() {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const [applications, setApplications] = useState([]);

  // Load user-specific applications when authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Check if we need to migrate old data
      const hasUserSpecificData = userStorage.getUserApplications(currentUser.id).length > 0;
      const hasOldData = storage.get('ai_tracker_applications', []).length > 0;
      
      if (!hasUserSpecificData && hasOldData) {
        // Migrate existing data to user-specific format
        migrateToUserSpecific(currentUser.id);
      }
      
      const userApplications = userStorage.getUserApplications(currentUser.id);
      setApplications(userApplications);
    } else {
      setApplications([]);
    }
  }, [isAuthenticated, currentUser]);

  // Save user-specific applications whenever they change
  useEffect(() => {
    if (isAuthenticated && currentUser && applications.length >= 0) {
      userStorage.setUserApplications(currentUser.id, applications);
    }
  }, [applications, isAuthenticated, currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="min-h-screen gradient-bg flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard applications={applications} />} 
            />
            <Route 
              path="/tracker" 
              element={
                <ApplicationTracker 
                  applications={applications}
                  setApplications={setApplications}
                />
              } 
            />
            <Route 
              path="/interview" 
              element={<InterviewPrep />} 
            />
            <Route 
              path="/reminders" 
              element={<Reminders />} 
            />
            <Route 
              path="/calendar" 
              element={<CalendarView />} 
            />
            <Route 
              path="/analytics" 
              element={<Analytics />} 
            />
            <Route 
              path="/profile" 
              element={<UserProfile />} 
            />
            <Route 
              path="/terms" 
              element={<TermsOfService />} 
            />
            <Route 
              path="/privacy" 
              element={<PrivacyPolicy />} 
            />
          </Routes>
          </motion.div>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
