import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Briefcase,
  Mail,
  Phone
} from 'lucide-react';
import { remindersStorage, applicationsStorage } from '../utils/storage';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'followup',
    applicationId: '',
    priority: 'medium',
    status: 'pending'
  });
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    setReminders(remindersStorage.get());
    setApplications(applicationsStorage.get());
  }, []);

  useEffect(() => {
    if (reminders.length > 0 || remindersStorage.get().length > 0) {
      remindersStorage.set(reminders);
    }
  }, [reminders]);

  // Check for due reminders
  useEffect(() => {
    const checkDueReminders = () => {
      const now = new Date();
      const dueReminders = reminders.filter(reminder => {
        if (reminder.status !== 'pending') return false;
        const reminderDate = new Date(`${reminder.date}T${reminder.time || '09:00'}`);
        return reminderDate <= now;
      });

      dueReminders.forEach(reminder => {
        toast(`Reminder: ${reminder.title}`, {
          icon: <Bell className="w-5 h-5" />,
          duration: 5000,
        });
      });
    };

    checkDueReminders();
    const interval = setInterval(checkDueReminders, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingReminder) {
      setReminders(rems => 
        rems.map(rem => 
          rem.id === editingReminder.id 
            ? { ...formData, id: editingReminder.id }
            : rem
        )
      );
      toast.success('Reminder updated successfully!');
    } else {
      const newReminder = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setReminders([...reminders, newReminder]);
      toast.success('Reminder created successfully!');
    }
    
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'followup',
      applicationId: '',
      priority: 'medium',
      status: 'pending'
    });
    setShowForm(false);
    setEditingReminder(null);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setFormData(reminder);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter(rem => rem.id !== id));
    toast.success('Reminder deleted successfully!');
  };

  const toggleComplete = (id) => {
    setReminders(reminders.map(rem => 
      rem.id === id 
        ? { ...rem, status: rem.status === 'pending' ? 'completed' : 'pending' }
        : rem
    ));
  };

  const getApplicationTitle = (appId) => {
    const app = applications.find(a => a.id === appId);
    return app ? `${app.position} at ${app.company}` : 'Unknown Application';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'followup':
        return <Mail className="w-4 h-4" />;
      case 'interview':
        return <Briefcase className="w-4 h-4" />;
      case 'phonecall':
        return <Phone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const isOverdue = (date, time) => {
    const reminderDate = new Date(`${date}T${time || '09:00'}`);
    return reminderDate < new Date();
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    // Sort by date and time
    const dateA = new Date(`${a.date}T${a.time || '09:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '09:00'}`);
    return dateA - dateB;
  });

  const pendingReminders = sortedReminders.filter(r => r.status === 'pending');
  const completedReminders = sortedReminders.filter(r => r.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Reminders</h2>
          <p className="text-white/70">Stay on top of follow-ups and important dates</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Reminder</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{pendingReminders.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{completedReminders.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-white">
                {pendingReminders.filter(r => isOverdue(r.date, r.time)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="Follow up with recruiter"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                >
                  <option value="followup">Follow-up</option>
                  <option value="interview">Interview</option>
                  <option value="phonecall">Phone Call</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Related Application</label>
                <select
                  value={formData.applicationId}
                  onChange={(e) => setFormData({...formData, applicationId: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                >
                  <option value="">Select Application</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.position} at {app.company}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                placeholder="Additional details about this reminder..."
              />
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium"
              >
                {editingReminder ? 'Update Reminder' : 'Add Reminder'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingReminder(null);
                  setFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    type: 'followup',
                    applicationId: '',
                    priority: 'medium',
                    status: 'pending'
                  });
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reminders List */}
      <div className="space-y-6">
        {/* Pending Reminders */}
        {pendingReminders.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Pending Reminders</h3>
            <div className="space-y-4">
              {pendingReminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-effect rounded-2xl p-6 card-hover ${
                    isOverdue(reminder.date, reminder.time) ? 'border-red-500/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isOverdue(reminder.date, reminder.time) 
                            ? 'bg-red-500/20' 
                            : 'bg-white/10'
                        }`}>
                          {getTypeIcon(reminder.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{reminder.title}</h4>
                          {reminder.applicationId && (
                            <p className="text-white/60 text-sm">
                              {getApplicationTitle(reminder.applicationId)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                        <div className="flex items-center space-x-1 text-white/60">
                          <Calendar className="w-4 h-4" />
                          <span>{reminder.date}</span>
                        </div>
                        {reminder.time && (
                          <div className="flex items-center space-x-1 text-white/60">
                            <Clock className="w-4 h-4" />
                            <span>{reminder.time}</span>
                          </div>
                        )}
                        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority}
                        </div>
                        {isOverdue(reminder.date, reminder.time) && (
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
                      
                      {reminder.description && (
                        <p className="text-white/60">{reminder.description}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleComplete(reminder.id)}
                        className="w-8 h-8 bg-green-500/20 hover:bg-green-500/30 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(reminder)}
                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Edit className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(reminder.id)}
                        className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Completed Reminders</h3>
            <div className="space-y-4">
              {completedReminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect rounded-2xl p-6 opacity-60"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white line-through">{reminder.title}</h4>
                          {reminder.applicationId && (
                            <p className="text-white/60 text-sm">
                              {getApplicationTitle(reminder.applicationId)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center space-x-1 text-white/60">
                          <Calendar className="w-4 h-4" />
                          <span>{reminder.date}</span>
                        </div>
                        {reminder.time && (
                          <div className="flex items-center space-x-1 text-white/60">
                            <Clock className="w-4 h-4" />
                            <span>{reminder.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleComplete(reminder.id)}
                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <AlertCircle className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(reminder.id)}
                        className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {reminders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl p-12 text-center"
          >
            <Bell className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Reminders Yet</h3>
            <p className="text-white/60 mb-6">Create reminders to stay on top of your job search</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Reminder</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
