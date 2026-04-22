import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  MapPin, 
  DollarSign,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Upload,
  FileText,
  Phone,
  Mail,
  User,
  MessageSquare,
  Search,
  Filter,
  TrendingUp,
  Building,
  Target,
  Star,
  AlertCircle
} from 'lucide-react';
import { userStorage } from '../utils/storage';

const ApplicationTracker = ({ applications, setApplications }) => {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    status: 'applied',
    date: new Date().toISOString().split('T')[0],
    description: '',
    jobUrl: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    followUpDate: '',
    notes: '',
  });
  const [showNotes, setShowNotes] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingApp) {
      setApplications(apps => 
        apps.map(app => 
          app.id === editingApp.id 
            ? { ...formData, id: editingApp.id }
            : app
        )
      );
      toast.success('Application updated successfully!');
    } else {
      const newApp = {
        ...formData,
        id: Date.now().toString(),
      };
      setApplications([...applications, newApp]);
      toast.success('Application added successfully!');
    }
    
    setFormData({
      company: '',
      position: '',
      location: '',
      salary: '',
      status: 'applied',
      date: new Date().toISOString().split('T')[0],
      description: '',
      jobUrl: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      followUpDate: '',
      notes: '',
    });
    setShowForm(false);
    setEditingApp(null);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setFormData(app);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setApplications(apps => apps.filter(app => app.id !== id));
    setDeleteConfirm(null);
    toast.success('Application deleted.');
  };

  const exportData = () => {
    const data = {
      applications: applications,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Applications exported successfully!');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.applications && Array.isArray(data.applications)) {
          setApplications(data.applications);
          toast.success(`Imported ${data.applications.length} applications successfully!`);
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Error importing file');
      }
    };
    reader.readAsText(file);
  };

  const addNote = (applicationId) => {
    if (!noteText.trim() || !currentUser) return;
    
    const note = {
      id: Date.now().toString(),
      applicationId,
      text: noteText,
      timestamp: new Date().toISOString(),
    };
    
    userStorage.addUserNote(currentUser.id, note);
    setNoteText('');
    toast.success('Note added successfully!');
  };

  const getNotes = (applicationId) => {
    if (!currentUser) return [];
    return userStorage.getUserNotes(currentUser.id).filter(note => note.applicationId === applicationId);
  };

  const filteredAndSortedApplications = useMemo(() => {
    return applications
      .filter(app => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = !search ||
          (app.company || '').toLowerCase().includes(search) ||
          (app.position || '').toLowerCase().includes(search) ||
          (app.location || '').toLowerCase().includes(search);
        const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'company') return (a.company || '').localeCompare(b.company || '');
        if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '');
        return 0;
      });
  }, [applications, searchTerm, filterStatus, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'interview': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'offer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Clock className="w-4 h-4" />;
      case 'interview': return <Briefcase className="w-4 h-4" />;
      case 'offer': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Application Tracker
            </h2>
            <p className="text-white/70 text-lg">Manage your job applications and track their progress</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportData}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 border border-white/20 hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </motion.button>
            
            <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl flex items-center space-x-2 cursor-pointer transition-all duration-200 border border-white/20 hover:shadow-lg">
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add Application</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: applications.length, icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
            { label: 'Applied', value: applications.filter(a => a.status === 'applied').length, icon: Clock, color: 'from-blue-500 to-blue-600' },
            { label: 'Interviews', value: applications.filter(a => a.status === 'interview').length, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
            { label: 'Offers', value: applications.filter(a => a.status === 'offer').length, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-effect rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all"
          >
            <option value="all" style={{ color: '#000', backgroundColor: '#fff' }}>All Status</option>
            <option value="applied" style={{ color: '#000', backgroundColor: '#fff' }}>Applied</option>
            <option value="interview" style={{ color: '#000', backgroundColor: '#fff' }}>Interview</option>
            <option value="offer" style={{ color: '#000', backgroundColor: '#fff' }}>Offer</option>
            <option value="rejected" style={{ color: '#000', backgroundColor: '#fff' }}>Rejected</option>
            <option value="withdrawn" style={{ color: '#000', backgroundColor: '#fff' }}>Withdrawn</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all"
          >
            <option value="date" style={{ color: '#000', backgroundColor: '#fff' }}>Sort by Date</option>
            <option value="company" style={{ color: '#000', backgroundColor: '#fff' }}>Sort by Company</option>
            <option value="status" style={{ color: '#000', backgroundColor: '#fff' }}>Sort by Status</option>
          </select>
        </div>
      </motion.div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            {editingApp ? 'Edit Application' : 'Add New Application'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Position</label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="Job title"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="City, State or Remote"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Salary Range</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="$80,000 - $100,000"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Application Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="rejected">Rejected</option>
                  <option value="offer">Offer</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Contact Name</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="Hiring manager name"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="contact@company.com"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Follow-up Date</label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Job Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                placeholder="Brief description of the role..."
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Job URL</label>
              <input
                type="url"
                value={formData.jobUrl}
                onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                placeholder="https://company.com/job-posting"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                placeholder="Additional notes about this application..."
              />
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium"
              >
                {editingApp ? 'Update Application' : 'Add Application'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingApp(null);
                  setFormData({
                    company: '',
                    position: '',
                    location: '',
                    salary: '',
                    status: 'applied',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    jobUrl: '',
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

      {/* Applications List */}
      <div className="space-y-4">
        {filteredAndSortedApplications.length > 0 ? (
          filteredAndSortedApplications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
              className="glass-effect rounded-2xl p-6 card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{app.position}</h3>
                      <p className="text-white/70">{app.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {app.location && (
                      <div className="flex items-center space-x-1 text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span>{app.location}</span>
                      </div>
                    )}
                    {app.salary && (
                      <div className="flex items-center space-x-1 text-white/60">
                        <DollarSign className="w-4 h-4" />
                        <span>{app.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-white/60">
                      <Calendar className="w-4 h-4" />
                      <span>{app.date}</span>
                    </div>
                  </div>
                  
                  {app.description && (
                    <p className="text-white/60 mt-3 line-clamp-2">{app.description}</p>
                  )}
                  
                  {(app.contactName || app.contactEmail || app.contactPhone) && (
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      {app.contactName && (
                        <div className="flex items-center space-x-1 text-white/60">
                          <User className="w-4 h-4" />
                          <span>{app.contactName}</span>
                        </div>
                      )}
                      {app.contactEmail && (
                        <div className="flex items-center space-x-1 text-white/60">
                          <Mail className="w-4 h-4" />
                          <span>{app.contactEmail}</span>
                        </div>
                      )}
                      {app.contactPhone && (
                        <div className="flex items-center space-x-1 text-white/60">
                          <Phone className="w-4 h-4" />
                          <span>{app.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {app.followUpDate && (
                    <div className="mt-2 flex items-center space-x-1 text-yellow-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Follow-up: {app.followUpDate}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 ml-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span className="text-sm font-medium capitalize">{app.status}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {app.jobUrl && (
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </motion.a>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(app)}
                      className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowNotes(showNotes === app.id ? null : app.id)}
                      className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                    </motion.button>
                    {deleteConfirm === app.id ? (
                      <div className="flex items-center space-x-1">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(app.id)}
                          className="px-2 py-1 bg-red-500/40 hover:bg-red-500/60 text-red-300 text-xs rounded-lg transition-colors"
                        >
                          Delete
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white/60 text-xs rounded-lg transition-colors"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteConfirm(app.id)}
                        className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            
            {/* Notes Section */}
            {showNotes === app.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <h4 className="text-white font-medium mb-3">Notes</h4>
                
                {/* Existing Notes */}
                <div className="space-y-2 mb-4">
                  {getNotes(app.id).map((note) => (
                    <div key={note.id} className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/80 text-sm">{note.text}</p>
                      <p className="text-white/50 text-xs mt-1">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {getNotes(app.id).length === 0 && (
                    <p className="text-white/50 text-sm">No notes yet. Add one below!</p>
                  )}
                </div>
                
                {/* Add Note Form */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addNote(app.id);
                      }
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addNote(app.id)}
                    className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm"
                  >
                    Add
                  </motion.button>
                </div>
              </motion.div>
            )}
            </motion.div>
          ))
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl p-12 text-center"
          >
            <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Applications Yet</h3>
            <p className="text-white/60 mb-6">Start tracking your job applications to see them here</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Application</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl p-12 text-center"
          >
            <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
            <p className="text-white/60 mb-4">No applications match your current filters</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors text-sm"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;
