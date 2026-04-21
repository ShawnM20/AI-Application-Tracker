import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
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
              <FileText className="w-8 h-8 text-primary-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
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
              <Shield className="w-6 h-6 mr-2 text-primary-400" />
              Agreement to Terms
            </h2>
            <div className="text-gray-100 space-y-3">
              <p>
                Welcome to AI Application Tracker. These Terms of Service ("Terms") govern your use of our 
                AI-powered job application tracking and interview preparation platform.
              </p>
              <p>
                By accessing or using AI Application Tracker, you agree to be bound by these Terms. 
                If you disagree with any part of these terms, then you may not access the service.
              </p>
            </div>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Services Description</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                AI Application Tracker provides the following services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li>Job application tracking and management</li>
                <li>AI-powered interview preparation using multiple AI providers</li>
                <li>Interview question generation and practice</li>
                <li>Career guidance and preparation tips</li>
                <li>Application status tracking and analytics</li>
                <li>Calendar integration for interview scheduling</li>
                <li>Reminder system for important deadlines</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-primary-400" />
              User Responsibilities
            </h2>
            <div className="text-gray-100 space-y-3">
              <p>As a user of AI Application Tracker, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li>Provide accurate and truthful information when creating your account</li>
                <li>Use the service for legitimate job search and career development purposes</li>
                <li>Not share your account credentials with others</li>
                <li>Not attempt to reverse engineer or hack the AI systems</li>
                <li>Not use the service for any illegal or harmful purposes</li>
                <li>Respect intellectual property rights of AI providers and content creators</li>
                <li>Not attempt to circumvent usage limitations or API restrictions</li>
              </ul>
            </div>
          </section>

          {/* AI Services Usage */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">AI Services Usage</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                Our service integrates with various AI providers to generate interview preparation content:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li><strong>Groq:</strong> Free AI service with included API access</li>
                <li><strong>Together AI:</strong> Free tier available with user-provided API key</li>
                <li><strong>Hugging Face:</strong> Free tier available with user-provided API key</li>
                <li><strong>OpenAI:</strong> Paid service requiring user-provided API key</li>
                <li><strong>Anthropic:</strong> Paid service requiring user-provided API key</li>
              </ul>
              <p className="mt-4">
                Users are responsible for any costs associated with paid AI services and for complying 
                with the terms of service of individual AI providers.
              </p>
            </div>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Data and Privacy</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                We respect your privacy and handle your data in accordance with our Privacy Policy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li>All user data is stored locally in your browser</li>
                <li>We do not sell or share your personal information with third parties</li>
                <li>AI interactions may be processed by third-party AI providers</li>
                <li>You are responsible for the security of your API keys</li>
                <li>We implement reasonable security measures to protect your data</li>
              </ul>
            </div>
          </section>

          {/* Limitations and Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2 text-primary-400" />
              Limitations and Disclaimers
            </h2>
            <div className="text-gray-100 space-y-3">
              <p>
                Please understand the following limitations:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-100">
                <li>AI-generated content is for informational purposes only</li>
                <li>We do not guarantee job placement or interview success</li>
                <li>AI responses may not always be accurate or complete</li>
                <li>Users should verify all information independently</li>
                <li>We are not responsible for decisions made based on AI-generated content</li>
                <li>Service availability depends on third-party AI providers</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                The service and its original content, features, and functionality are owned by 
                AI Application Tracker and are protected by international copyright, trademark, 
                patent, trade secret, and other intellectual property laws.
              </p>
              <p>
                You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, 
                license, create derivative works from, transfer, or sell any information obtained from 
                the service.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                We may terminate or suspend your account and bar access to the service immediately, 
                without prior notice or liability, under our sole discretion, for any reason whatsoever 
                and without limitation.
              </p>
              <p>
                Upon termination, your right to use the service will cease immediately. All provisions 
                of the Terms which by their nature should survive termination shall survive.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <div className="text-gray-100 space-y-3">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <p className="text-primary-400">Email: support@aiapplicationtracker.com</p>
                <p className="text-primary-400">Website: www.aiapplicationtracker.com</p>
              </div>
            </div>
          </section>

          {/* Agreement */}
          <section className="border-t border-white/20 pt-8">
            <p className="text-white/80 text-center">
              By using AI Application Tracker, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service.
            </p>
          </section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
