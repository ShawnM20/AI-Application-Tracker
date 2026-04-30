import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Brain,
  Briefcase,
  Building,
  Target,
  Lightbulb,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Loader2,
  Settings,
  Mic,
  MicOff,
  Award,
  Sparkles,
} from 'lucide-react';
import aiService from '../services/aiService';
import { useAuth } from '../contexts/AuthContext';
import { getSettings, saveSettings } from '../utils/db';
import { settingsStorage } from '../utils/storage';

const InterviewPrep = () => {
  const { currentUser } = useAuth();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    aiProvider: 'groq', // uses REACT_APP_GROQ_API_KEY from env
    groqApiKey: '',
    togetherApiKey: '',
    huggingfaceApiKey: '',
    openaiApiKey: '',
    anthropicApiKey: '',
    theme: 'purple',
    darkMode: false,
    notifications: true,
    defaultExperience: '',
    autoSave: true,
    voiceEnabled: false,
    videoEnabled: false,
    difficulty: 'medium',
    questionType: 'behavioral'
  });

  useEffect(() => {
    if (!currentUser) return;
    getSettings(currentUser.uid).then((saved) => {
      if (saved && Object.keys(saved).length > 0) {
        setSettings((prev) => ({ ...prev, ...saved }));
        // Sync to localStorage so aiService can read synchronously
        settingsStorage.set({ ...settings, ...saved });
      }
    });
  }, [currentUser]); // eslint-disable-line

  const generateInterviewPrep = async () => {
    if (!jobTitle) {
      toast.error('Please enter a job title');
      return;
    }

    setLoading(true);
    setInterviewData(null);

    try {
      const response = await aiService.generateInterviewPrep(jobTitle, company, experience);
      setInterviewData(response);
      toast.success('Interview preparation generated successfully!');
    } catch (error) {
      console.error('AI Service Error:', error);
      toast.error(error.message || 'Failed to generate interview preparation');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (key, value) => {
    if (!currentUser) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    // Keep localStorage in sync so aiService can read synchronously
    settingsStorage.set(newSettings);
    aiService.updateSettings();
    // Persist to Firestore (fire-and-forget)
    saveSettings(currentUser.uid, newSettings);
  };

  const testAPIConnection = async () => {
    try {
      setLoading(true);
      await aiService.generateInterviewPrep('Test Position', 'Test Company', 'entry');
      toast.success('API connection successful!');
    } catch (error) {
      toast.error('API connection failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'questions', label: 'Interview Questions', icon: MessageSquare },
    { id: 'lookfor', label: 'What They Look For', icon: Target },
    { id: 'tips', label: 'Preparation Tips', icon: Lightbulb },
    { id: 'mistakes', label: 'Common Mistakes', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            AI Interview Preparation
          </h2>
          <p className="text-white/70 text-lg">Get personalized interview questions and preparation tips powered by AI</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Sessions', value: sessionHistory.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: 'Questions', value: interviewData?.questions?.length || 0, icon: MessageSquare, color: 'from-purple-500 to-pink-500' },
            { label: 'Est. Prep Time', value: '45 min', icon: Clock, color: 'from-green-500 to-emerald-500' },
            { label: 'Topics Covered', value: interviewData ? 4 : 0, icon: Award, color: 'from-orange-500 to-red-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-effect rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8 border border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Job Title *</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all"
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Company (Optional)</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all"
                placeholder="e.g., Google, Microsoft"
              />
            </div>
          </div>
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Experience Level</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all appearance-none cursor-pointer"
            >
              <option value="" style={{ color: '#000', backgroundColor: '#fff' }}>Select experience</option>
              <option value="entry" style={{ color: '#000', backgroundColor: '#fff' }}>Entry Level (0-2 years)</option>
              <option value="mid" style={{ color: '#000', backgroundColor: '#fff' }}>Mid Level (2-5 years)</option>
              <option value="senior" style={{ color: '#000', backgroundColor: '#fff' }}>Senior Level (5+ years)</option>
              <option value="lead" style={{ color: '#000', backgroundColor: '#fff' }}>Lead/Manager</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateInterviewPrep}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating AI Preparation...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Generate Interview Prep</span>
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-medium flex items-center space-x-2 border border-white/20 hover:shadow-lg transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Advanced Settings</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Results */}
      {interviewData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-8"
          >
            {activeTab === 'questions' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <MessageSquare className="w-6 h-6" />
                  <span>Common Interview Questions</span>
                </h3>
                <div className="space-y-3">
                  {interviewData.questions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-400 font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-white leading-relaxed">{question}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'lookfor' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Target className="w-6 h-6" />
                  <span>What Employers Look For</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviewData.whatTheyLookFor.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <p className="text-white/90">{item}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Lightbulb className="w-6 h-6" />
                  <span>Preparation Tips</span>
                </h3>
                <div className="space-y-3">
                  {interviewData.preparationTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-4 h-4 text-yellow-400" />
                        </div>
                        <p className="text-white leading-relaxed">{tip}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mistakes' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>Common Mistakes to Avoid</span>
                </h3>
                <div className="space-y-3">
                  {interviewData.commonMistakes.map((mistake, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-red-400 font-bold text-sm">!</span>
                        </div>
                        <p className="text-white leading-relaxed">{mistake}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6 border border-white/20 space-y-5"
        >
          <h3 className="text-lg font-bold text-white">Interview Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Question Type</label>
              <select
                value={settings.questionType}
                onChange={(e) => updateSettings('questionType', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-400"
              >
                <option value="behavioral" style={{ color: '#000', backgroundColor: '#fff' }}>Behavioral</option>
                <option value="technical" style={{ color: '#000', backgroundColor: '#fff' }}>Technical</option>
                <option value="situational" style={{ color: '#000', backgroundColor: '#fff' }}>Situational</option>
                <option value="mixed" style={{ color: '#000', backgroundColor: '#fff' }}>Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Difficulty</label>
              <select
                value={settings.difficulty}
                onChange={(e) => updateSettings('difficulty', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-400"
              >
                <option value="easy" style={{ color: '#000', backgroundColor: '#fff' }}>Easy</option>
                <option value="medium" style={{ color: '#000', backgroundColor: '#fff' }}>Medium</option>
                <option value="hard" style={{ color: '#000', backgroundColor: '#fff' }}>Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Voice Recording</label>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateSettings('voiceEnabled', !settings.voiceEnabled)}
                className={`w-full px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all border ${
                  settings.voiceEnabled
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-white/10 text-white/70 border-white/20'
                }`}
              >
                {settings.voiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                <span>{settings.voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!interviewData && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-effect rounded-2xl p-12 text-center"
        >
          <Brain className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Ready to Ace Your Interview?</h3>
          <p className="text-white/60 mb-6">Enter a job title to get personalized interview questions and preparation tips</p>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewPrep;
