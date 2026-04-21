import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary-900/50 to-secondary-900/50 backdrop-blur-md border-t border-white/10 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-bold text-lg">AI Application Tracker</span>
            </div>
            <p className="text-white/60 text-sm">
              Your intelligent companion for job applications and interview preparation.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@aiapplicationtracker.com"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Features</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>Application Tracking</li>
              <li>AI Interview Prep</li>
              <li>Calendar Integration</li>
              <li>Smart Reminders</li>
              <li>Analytics Dashboard</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Resources</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/interview" className="hover:text-white transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Legal</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} AI Application Tracker. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-white/60 text-sm">
              <span>Built with React & AI</span>
              <span>Powered by Groq, Together AI & More</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
