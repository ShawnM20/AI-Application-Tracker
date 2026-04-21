import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Brain, 
  Search, 
  TrendingUp,
  Clock,
  Target,
  Award,
  ArrowRight
} from 'lucide-react';

const Dashboard = ({ applications }) => {
  const stats = [
    {
      title: 'Total Applications',
      value: applications.length,
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'Interviews Scheduled',
      value: applications.filter(app => app.status === 'interview').length,
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      change: '+8%',
    },
    {
      title: 'Response Rate',
      value: '68%',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+15%',
    },
    {
      title: 'Active Searches',
      value: '5',
      icon: Search,
      color: 'from-orange-500 to-orange-600',
      change: '+2',
    },
  ];

  const features = [
    {
      title: 'Track Applications',
      description: 'Monitor your job applications with detailed status tracking and follow-up reminders.',
      icon: Briefcase,
      link: '/tracker',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'AI Interview Prep',
      description: 'Get personalized interview questions and preparation tips powered by AI.',
      icon: Brain,
      link: '/interview',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Smart Job Search',
      description: 'Find relevant job opportunities and get AI-powered insights about companies.',
      icon: Search,
      link: '/jobs',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          Welcome to Your AI Career Hub
        </h2>
        <p className="text-white/80 text-lg">
          Track applications, prepare for interviews, and land your dream job with AI-powered insights
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="glass-effect rounded-2xl p-8 card-hover group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70 mb-6 leading-relaxed">{feature.description}</p>
              <Link to={feature.link}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-white font-medium hover:text-white/80 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-effect rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {applications.slice(0, 3).map((app, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{app.company}</p>
                  <p className="text-white/60 text-sm">{app.position}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  app.status === 'interview' ? 'bg-green-500/20 text-green-400' :
                  app.status === 'applied' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {app.status}
                </span>
                <span className="text-white/60 text-sm">{app.date}</span>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No applications yet. Start tracking your job search!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
