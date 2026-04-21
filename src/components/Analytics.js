import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  PieChart,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Download,
  Filter
} from 'lucide-react';
import { applicationsStorage, remindersStorage, notesStorage } from '../utils/storage';

const Analytics = () => {
  const [applications, setApplications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setApplications(applicationsStorage.get());
    setReminders(remindersStorage.get());
    setNotes(notesStorage.get());
  }, []);

  const filterByTimeRange = (items, dateField = 'date') => {
    if (timeRange === 'all') return items;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return items;
    }
    
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= cutoffDate;
    });
  };

  const filteredApplications = filterByTimeRange(applications);
  const filteredReminders = filterByTimeRange(reminders);

  // Calculate metrics
  const totalApplications = filteredApplications.length;
  const interviewsCount = filteredApplications.filter(app => app.status === 'interview').length;
  const offersCount = filteredApplications.filter(app => app.status === 'offer').length;
  const rejectedCount = filteredApplications.filter(app => app.status === 'rejected').length;
  const pendingCount = filteredApplications.filter(app => app.status === 'applied').length;

  const responseRate = totalApplications > 0 
    ? Math.round(((interviewsCount + offersCount + rejectedCount) / totalApplications) * 100)
    : 0;

  const interviewRate = totalApplications > 0
    ? Math.round((interviewsCount / totalApplications) * 100)
    : 0;

  const offerRate = interviewsCount > 0
    ? Math.round((offersCount / interviewsCount) * 100)
    : 0;

  // Status distribution
  const statusDistribution = [
    { label: 'Applied', value: pendingCount, color: 'bg-blue-500' },
    { label: 'Interview', value: interviewsCount, color: 'bg-purple-500' },
    { label: 'Offer', value: offersCount, color: 'bg-green-500' },
    { label: 'Rejected', value: rejectedCount, color: 'bg-red-500' },
  ].filter(item => item.value > 0);

  // Time to response analysis
  const getResponseTimes = () => {
    const responses = filteredApplications.filter(app => 
      app.status !== 'applied' && app.date
    );
    
    if (responses.length === 0) return null;
    
    const responseTimes = responses.map(app => {
      const appliedDate = new Date(app.date);
      const today = new Date();
      const daysDiff = Math.floor((today - appliedDate) / (1000 * 60 * 60 * 24));
      return daysDiff;
    });
    
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    return Math.round(avgResponseTime);
  };

  const avgResponseTime = getResponseTimes();

  // Top companies
  const topCompanies = filteredApplications.reduce((acc, app) => {
    const company = app.company;
    if (!acc[company]) {
      acc[company] = { name: company, count: 0, interviews: 0, offers: 0 };
    }
    acc[company].count++;
    if (app.status === 'interview') acc[company].interviews++;
    if (app.status === 'offer') acc[company].offers++;
    return acc;
  }, {});

  const sortedCompanies = Object.values(topCompanies)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Activity timeline
  const getActivityTimeline = () => {
    const activities = [];
    
    filteredApplications.forEach(app => {
      activities.push({
        type: 'application',
        date: app.date,
        title: `Applied to ${app.position} at ${app.company}`,
        company: app.company,
        status: app.status
      });
    });

    filteredReminders.forEach(reminder => {
      activities.push({
        type: 'reminder',
        date: reminder.date,
        title: reminder.title,
        priority: reminder.priority
      });
    });

    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const timeline = getActivityTimeline();

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      metrics: {
        totalApplications,
        interviewsCount,
        offersCount,
        rejectedCount,
        pendingCount,
        responseRate,
        interviewRate,
        offerRate,
        avgResponseTime
      },
      topCompanies: sortedCompanies,
      statusDistribution,
      applications: filteredApplications,
      reminders: filteredReminders
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-search-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h2>
          <p className="text-white/70">Track your job search progress and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/20 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-white/40"
          >
            <option value="all" style={{ color: '#000000', backgroundColor: '#ffffff' }}>All Time</option>
            <option value="year" style={{ color: '#000000', backgroundColor: '#ffffff' }}>Last Year</option>
            <option value="quarter" style={{ color: '#000000', backgroundColor: '#ffffff' }}>Last Quarter</option>
            <option value="month" style={{ color: '#000000', backgroundColor: '#ffffff' }}>Last Month</option>
            <option value="week" style={{ color: '#000000', backgroundColor: '#ffffff' }}>Last Week</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportReport}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-400 text-sm font-medium">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{totalApplications}</h3>
          <p className="text-white/70 text-sm">Applications</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-purple-400 text-sm font-medium">{responseRate}%</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{interviewsCount}</h3>
          <p className="text-white/70 text-sm">Interviews</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-400 text-sm font-medium">{offerRate}%</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{offersCount}</h3>
          <p className="text-white/70 text-sm">Offers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-orange-400 text-sm font-medium">Avg</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {avgResponseTime || 'N/A'}
          </h3>
          <p className="text-white/70 text-sm">Days to Response</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>Application Status</span>
          </h3>
          
          <div className="space-y-4">
            {statusDistribution.map((status, index) => (
              <div key={status.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{status.label}</span>
                  <span className="text-white font-medium">{status.value}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(status.value / totalApplications) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`${status.color} h-2 rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Companies */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Top Companies</span>
          </h3>
          
          <div className="space-y-4">
            {sortedCompanies.map((company, index) => (
              <div key={company.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">{company.name}</p>
                  <p className="text-white/60 text-sm">
                    {company.interviews} interviews, {company.offers} offers
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{company.count}</p>
                  <p className="text-white/60 text-sm">applications</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Performance Metrics</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/5 rounded-xl">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">{responseRate}%</h4>
            <p className="text-white/60">Response Rate</p>
            <p className="text-white/50 text-sm mt-2">
              Applications that received a response
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/5 rounded-xl">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">{interviewRate}%</h4>
            <p className="text-white/60">Interview Rate</p>
            <p className="text-white/50 text-sm mt-2">
              Applications that led to interviews
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/5 rounded-xl">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">{offerRate}%</h4>
            <p className="text-white/60">Offer Rate</p>
            <p className="text-white/50 text-sm mt-2">
              Interviews that resulted in offers
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Recent Activity</span>
        </h3>
        
        <div className="space-y-3">
          {timeline.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activity.type === 'application' 
                  ? 'bg-blue-500/20' 
                  : 'bg-purple-500/20'
              }`}>
                {activity.type === 'application' ? (
                  <Briefcase className="w-5 h-5 text-blue-400" />
                ) : (
                  <Clock className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.title}</p>
                <p className="text-white/60 text-sm">{activity.date}</p>
              </div>
              {activity.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                  activity.status === 'offer' ? 'bg-green-500/20 text-green-400' :
                  activity.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {activity.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
