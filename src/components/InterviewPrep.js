import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Brain, 
  Send, 
  Briefcase, 
  Target,
  Lightbulb,
  Clock,
  TrendingUp,
  Users,
  Code,
  MessageSquare,
  Loader2,
  Settings,
  Key,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import aiService from '../services/aiService';
import { useAuth } from '../contexts/AuthContext';
import { userStorage } from '../utils/storage';

const InterviewPrep = () => {
  const { currentUser } = useAuth();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    aiProvider: 'groq',
    groqApiKey: '',
    togetherApiKey: '',
    huggingfaceApiKey: '',
    openaiApiKey: '',
    anthropicApiKey: '',
    theme: 'purple',
    darkMode: false,
    notifications: true,
    defaultExperience: '',
    autoSave: true
  });

  useEffect(() => {
    if (currentUser) {
      const userSettings = userStorage.getUserSettings(currentUser.id);
      setSettings({
        aiProvider: userSettings.aiProvider || 'groq',
        groqApiKey: userSettings.groqApiKey || '',
        togetherApiKey: userSettings.togetherApiKey || '',
        huggingfaceApiKey: userSettings.huggingfaceApiKey || '',
        openaiApiKey: userSettings.openaiApiKey || '',
        anthropicApiKey: userSettings.anthropicApiKey || '',
        theme: userSettings.theme || 'purple',
        darkMode: userSettings.darkMode || false,
        notifications: userSettings.notifications !== undefined ? userSettings.notifications : true,
        defaultExperience: userSettings.defaultExperience || '',
        autoSave: userSettings.autoSave !== undefined ? userSettings.autoSave : true
      });
    }
  }, [currentUser]);

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
    userStorage.updateUserSettings(currentUser.id, newSettings);
    aiService.updateSettings();
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
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">AI Interview Preparation</h2>
        <p className="text-white/70 text-lg">Get personalized interview questions and preparation tips powered by AI</p>
      </div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Job Title *</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Company (Optional)</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              placeholder="e.g., Google, Microsoft"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Experience Level</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
            >
              <option value="">Select experience</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (2-5 years)</option>
              <option value="senior">Senior Level (5+ years)</option>
              <option value="lead">Lead/Manager</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateInterviewPrep}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Preparation...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Generate Interview Prep</span>
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span>AI Settings</span>
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

      {/* AI Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-effect rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-bold text-white mb-4">Choose AI Provider</h3>
          
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Select AI Provider</label>
            <select
              value={settings.aiProvider}
              onChange={(e) => updateSettings('aiProvider', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
              style={{ color: '#ffffff' }}
            >
              <option value="groq" style={{ color: '#000000', backgroundColor: '#ffffff' }}>Groq (Free - Fast)</option>
              <option value="together" style={{ color: '#000000', backgroundColor: '#ffffff' }}>Together AI (Free)</option>
              <option value="huggingface" style={{ color: '#000000', backgroundColor: '#ffffff' }}>Hugging Face (Free)</option>
              <option value="openai" style={{ color: '#000000', backgroundColor: '#ffffff' }}>OpenAI GPT (Paid)</option>
              <option value="anthropic" style={{ color: '#000000', backgroundColor: '#ffffff' }}>Anthropic Claude (Paid)</option>
              <option value="mock" style={{ color: '#000000', backgroundColor: '#ffffff' }}>Mock (Demo Only)</option>
            </select>
          </div>

          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-sm mb-3">
              {settings.aiProvider === 'groq' && 'Free Groq AI ready! Fast responses included.'}
              {settings.aiProvider === 'together' && 'Free Together AI available with your API key.'}
              {settings.aiProvider === 'huggingface' && 'Free Hugging Face available with your API key.'}
              {settings.aiProvider === 'openai' && 'OpenAI GPT requires your API key.'}
              {settings.aiProvider === 'anthropic' && 'Anthropic Claude requires your API key.'}
              {settings.aiProvider === 'mock' && 'Using demo responses. Try free AI options for real responses!'}
            </p>
            
            {/* Security Information */}
            <div className="mt-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-400">Shield</span>
                <p className="text-green-400 text-xs font-medium">Security Protected</p>
              </div>
              <p className="text-white/50 text-xs">
                All inputs are sanitized and validated with prompt injection protection to ensure safe AI interactions.
              </p>
            </div>
            
            {/* Usage and Management Information */}
            {settings.aiProvider === 'groq' && (
              <div className="space-y-2 text-white/50 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400">!</span>
                  <p><strong>Usage Limits:</strong> Shared key has rate limits for all users</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-">$</span>
                  <p><strong>Cost Management:</strong> All users draw from shared quota</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">%</span>
                  <p><strong>Monitoring:</strong> Track usage on your Groq dashboard</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400">+</span>
                  <p><strong>Scalability:</strong> May need additional keys for many users</p>
                </div>
              </div>
            )}
            
            {settings.aiProvider === 'together' && (
              <div className="space-y-2 text-white/50 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400">!</span>
                  <p><strong>Usage Limits:</strong> Free tier has monthly request limits</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">$</span>
                  <p><strong>Cost Management:</strong> Free tier available, paid for higher limits</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">%</span>
                  <p><strong>Monitoring:</strong> Track usage on Together.ai dashboard</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400">+</span>
                  <p><strong>Scalability:</strong> Multiple API keys can be configured</p>
                </div>
              </div>
            )}
            
            {settings.aiProvider === 'huggingface' && (
              <div className="space-y-2 text-white/50 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400">!</span>
                  <p><strong>Usage Limits:</strong> Free tier has inference limits</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">$</span>
                  <p><strong>Cost Management:</strong> Pay-as-you-go pricing available</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">%</span>
                  <p><strong>Monitoring:</strong> Track usage on Hugging Face dashboard</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400">+</span>
                  <p><strong>Scalability:</strong> Multiple models and endpoints available</p>
                </div>
              </div>
            )}
            
            {['openai', 'anthropic'].includes(settings.aiProvider) && (
              <div className="space-y-2 text-white/50 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400">!</span>
                  <p><strong>Usage Limits:</strong> Based on your API key limits</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">$</span>
                  <p><strong>Cost Management:</strong> Pay-per-use pricing model</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">%</span>
                  <p><strong>Monitoring:</strong> Track usage on provider dashboard</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400">+</span>
                  <p><strong>Scalability:</strong> Enterprise plans available</p>
                </div>
              </div>
            )}
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
