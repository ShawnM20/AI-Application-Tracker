import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, Lock, AlertTriangle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            </div>
            <p className="text-white/70 text-lg">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-effect rounded-2xl p-8 space-y-8"
        >
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-primary-400" />
              Our Commitment to Privacy
            </h2>
            <div className="text-gray-100 space-y-3">
              <p>
                At AI Application Tracker, we are committed to protecting your privacy and ensuring the 
                security of your personal information. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our AI-powered job application 
                tracking and interview preparation platform.
              </p>
              <p>
                By using AI Application Tracker, you agree to the collection and use of information 
                in accordance with this policy.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-primary-400" />
              Information We Collect
            </h2>
            <div className="text-gray-100 space-y-4">
              <h3 className="text-lg font-semibold text-white">Information You Provide</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li><strong>Account Information:</strong> Name, email address, and password for account creation</li>
                <li><strong>Profile Data:</strong> Career information, experience level, and preferences</li>
                <li><strong>Application Data:</strong> Job applications you track, companies, positions, and status</li>
                <li><strong>Interview Data:</strong> Interview preparation content and AI-generated responses</li>
                <li><strong>API Keys:</strong> AI service API keys you choose to provide (stored locally)</li>
                <li><strong>Settings:</strong> Theme preferences, notification settings, and other configuration</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6">Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li><strong>Usage Data:</strong> How you interact with our service and features</li>
                <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
                <li><strong>Technical Data:</strong> IP address, browser version, and access times</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <div className="text-gray-100 space-y-3">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li>Provide and maintain our AI Application Tracker service</li>
                <li>Generate personalized interview preparation content using AI</li>
                <li>Process and store your job application tracking data</li>
                <li>Communicate with you about service updates and support</li>
                <li>Analyze usage patterns to improve our service</li>
                <li>Ensure security and prevent fraudulent activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Data Storage and Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-primary-400" />
              Data Storage and Security
            </h2>
            <div className="text-gray-100 space-y-4">
              <h3 className="text-lg font-semibold text-white">Local Storage</h3>
              <p>
                All your personal data is stored locally in your browser using localStorage. This means:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li>Your data never leaves your device unless you choose to export it</li>
                <li>We do not have access to your personal application data</li>
                <li>You maintain full control over your information</li>
                <li>Data is only accessible to you on your device</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6">Security Measures</h3>
              <p>
                While data is stored locally, we implement security measures including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li>Encryption of sensitive data where appropriate</li>
                <li>Secure transmission of data to AI providers</li>
                <li>Input validation and sanitization to prevent injection attacks</li>
                <li>Regular security updates and monitoring</li>
              </ul>
            </div>
          </section>

          {/* AI Services and Third Parties */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">AI Services and Third Parties</h2>
            <div className="text-gray-100 space-y-4">
              <h3 className="text-lg font-semibold text-white">AI Provider Integration</h3>
              <p>
                Our service integrates with third-party AI providers to generate interview preparation content:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li><strong>Groq:</strong> Uses shared API key for free access</li>
                <li><strong>Together AI:</strong> Uses user-provided API keys</li>
                <li><strong>Hugging Face:</strong> Uses user-provided API keys</li>
                <li><strong>OpenAI:</strong> Uses user-provided API keys</li>
                <li><strong>Anthropic:</strong> Uses user-provided API keys</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6">Third-Party Data Sharing</h3>
              <p>
                Your interview preparation queries may be shared with AI providers for processing. 
                However:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li>We do not share your personal application data with third parties</li>
                <li>AI providers may have their own privacy policies and data usage terms</li>
                <li>You are responsible for reviewing AI provider terms</li>
                <li>API keys are stored locally and transmitted securely</li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                We use minimal cookies and tracking technologies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Preference Cookies:</strong> Store your theme and settings preferences</li>
                <li><strong>Session Cookies:</strong> Maintain your login state during your session</li>
              </ul>
              <p>
                We do not use tracking cookies for advertising or analytics purposes.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <div className="text-gray-100 space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li><strong>Access:</strong> View all data stored locally in your browser</li>
                <li><strong>Export:</strong> Download your data for personal use</li>
                <li><strong>Delete:</strong> Clear all local data by clearing your browser storage</li>
                <li><strong>Modify:</strong> Update or change your information at any time</li>
                <li><strong>Opt-out:</strong> Choose not to provide certain information</li>
              </ul>
              <p>
                Since data is stored locally, you have complete control over your information and can 
                delete it at any time by clearing your browser data.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If we become aware that we have 
                collected such information, we will delete it immediately.
              </p>
            </div>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">International Users</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                AI Application Tracker may be accessed from around the world. If you are accessing 
                our service from outside the United States, please be aware that your information may 
                be transferred to and processed in the United States, where our servers are located 
                and where our central database is operated.
              </p>
            </div>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes 
                to this Privacy Policy are effective when they are posted on this page.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <p className="text-primary-400">Email: privacy@aiapplicationtracker.com</p>
                <p className="text-primary-400">Website: www.aiapplicationtracker.com</p>
              </div>
            </div>
          </section>

          {/* Agreement */}
          <section className="border-t border-white/20 pt-8">
            <p className="text-white/80 text-center">
              By using AI Application Tracker, you acknowledge that you have read, understood, 
              and agree to this Privacy Policy.
            </p>
          </section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
