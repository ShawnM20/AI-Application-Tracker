import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Brain,
  TrendingUp,
  Award,
  ArrowRight,
  Calendar,
  BarChart3,
  AlertCircle,
  Activity
} from 'lucide-react';

const Dashboard = ({ applications }) => {
  const interviewsCount = applications.filter(app => app.status === 'interview').length;
  const pendingCount = applications.filter(app => app.status === 'applied').length;
  const offersCount = applications.filter(app => app.status === 'offer').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;
  
  const responseRate = applications.length > 0
    ? Math.round(((interviewsCount + offersCount) / applications.length) * 100)
    : 0;
  const successRate = applications.length > 0
    ? Math.round((offersCount / applications.length) * 100)
    : 0;

  const stats = [
    {
      title: 'Total Applications',
      value: applications.length,
      icon: Briefcase,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      progress: Math.min(100, applications.length * 2),
      description: 'All time applications'
    },
    {
      title: 'Interviews Scheduled',
      value: interviewsCount,
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      progress: applications.length > 0 ? Math.round((interviewsCount / applications.length) * 100) : 0,
      description: 'Active interviews'
    },
    {
      title: 'Response Rate',
      value: responseRate + '%',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      progress: responseRate,
      description: 'Interviews + offers'
    },
    {
      title: 'Success Rate',
      value: successRate + '%',
      icon: Award,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      progress: successRate,
      description: 'Offers received'
    },
  ];

  const features = [
    {
      title: 'Application Tracker',
      description: 'Monitor your job applications with detailed status tracking and follow-up reminders.',
      icon: Briefcase,
      link: '/tracker',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      stats: applications.length === 1 ? '1 application' : `${applications.length} applications`
    },
    {
      title: 'AI Interview Prep',
      description: 'Practice with AI-powered interview questions and get personalized feedback.',
      icon: Brain,
      link: '/interview',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      stats: interviewsCount === 1 ? '1 interview' : `${interviewsCount} interviews`
    },
    {
      title: 'Smart Analytics',
      description: 'Track your progress with detailed analytics and insights about your job search.',
      icon: BarChart3,
      link: '/analytics',
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      stats: applications.length > 0 ? `${successRate}% success rate` : 'No data yet'
    },
    {
      title: 'Calendar & Reminders',
      description: 'Never miss an interview with smart calendar integration and reminders.',
      icon: Calendar,
      link: '/calendar',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      stats: interviewsCount > 0 ? `${interviewsCount} upcoming` : 'No upcoming'
    },
  ];

  const recentActivity = applications.slice(-3).reverse();

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
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`glass-effect rounded-2xl p-6 border ${stat.borderColor} ${stat.bgColor} hover:shadow-2xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-white/50 text-xs text-right">{stat.description}</span>
              </div>
              <h3 className="text-white/70 text-sm font-medium mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${stat.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`glass-effect rounded-2xl p-6 border ${feature.borderColor} ${feature.bgColor} hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
            >
              <Link to={feature.link} className="block">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white/90 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs font-medium">{feature.stats}</span>
                  <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      {recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-effect rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Activity className="w-6 h-6 mr-2 text-primary-400" />
              Recent Activity
            </h3>
            <Link to="/tracker" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === 'interview' ? 'bg-purple-500/20' :
                    activity.status === 'offer' ? 'bg-green-500/20' :
                    activity.status === 'applied' ? 'bg-blue-500/20' :
                    'bg-gray-500/20'
                  }`}>
                    {
                      activity.status === 'interview' ? <Brain className="w-5 h-5 text-purple-400" /> :
                      activity.status === 'offer' ? <Award className="w-5 h-5 text-green-400" /> :
                      activity.status === 'applied' ? <Briefcase className="w-5 h-5 text-blue-400" /> :
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{activity.company}</h4>
                    <p className="text-white/60 text-sm">{activity.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                    activity.status === 'offer' ? 'bg-green-500/20 text-green-400' :
                    activity.status === 'applied' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {activity.status}
                  </span>
                  <p className="text-white/40 text-xs mt-1">
                    {activity.date ? new Date(activity.date).toLocaleDateString() : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-effect rounded-2xl p-6 border border-primary-500/20 bg-primary-500/10 cursor-pointer group"
        >
          <Link to="/tracker" className="block text-center">
            <Briefcase className="w-12 h-12 text-primary-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-bold mb-2">Add Application</h3>
            <p className="text-white/60 text-sm">Track a new job application</p>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-effect rounded-2xl p-6 border border-purple-500/20 bg-purple-500/10 cursor-pointer group"
        >
          <Link to="/interview" className="block text-center">
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-bold mb-2">Practice Interview</h3>
            <p className="text-white/60 text-sm">AI-powered interview prep</p>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-effect rounded-2xl p-6 border border-green-500/20 bg-green-500/10 cursor-pointer group"
        >
          <Link to="/analytics" className="block text-center">
            <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-bold mb-2">View Analytics</h3>
            <p className="text-white/60 text-sm">Track your progress</p>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
