import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogOut,
  Settings,
  Download,
  Trash2,
  Shield,
  Calendar,
  Briefcase
} from 'lucide-react';

const UserProfile = () => {
  const { currentUser, logout, updateProfile, changePassword, deleteAccount } = useAuth();
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmation: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    delete: false,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        toast.error(result.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (deleteData.confirmation !== 'DELETE MY ACCOUNT') {
      toast.error('Please type "DELETE MY ACCOUNT" exactly');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await deleteAccount(deleteData.password);
      if (result.success) {
        toast.success('Account deleted successfully');
        // User will be automatically logged out
      } else {
        toast.error(result.error || 'Failed to delete account');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const exportUserData = () => {
    if (!currentUser) return;
    
    const userData = {
      profile: currentUser,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-profile-${currentUser.email}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('User data exported successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Settings },
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">User Profile</h2>
          <p className="text-white/70">Manage your account settings and preferences</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-xl flex items-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </div>

      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8"
      >
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {currentUser.firstName} {currentUser.lastName}
            </h3>
            <p className="text-white/70">{currentUser.email}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-white/60">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span>Last login {new Date(currentUser.lastLogin).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2">
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

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8"
      >
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Edit Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed"
              />
              <p className="text-white/50 text-xs mt-1">Email cannot be changed</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </form>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>
              
              {!showPasswordForm ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPasswordForm(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl flex items-center space-x-2"
                >
                  <Lock className="w-5 h-5" />
                  <span>Change Password</span>
                </motion.button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        required
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        required
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50"
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-medium"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Data Management</h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-medium mb-2">Export Your Data</h4>
                <p className="text-white/60 text-sm mb-4">
                  Download a copy of your profile information and settings.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportUserData}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-6 py-2 rounded-xl flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </motion.button>
              </div>
              
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <h4 className="text-red-400 font-medium mb-2">Delete Account</h4>
                <p className="text-white/60 text-sm mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                
                {!showDeleteForm ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteForm(true)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-2 rounded-xl flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </motion.button>
                ) : (
                  <form onSubmit={handleDeleteAccount} className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          type={showPasswords.delete ? "text" : "password"}
                          value={deleteData.password}
                          onChange={(e) => setDeleteData({...deleteData, password: e.target.value})}
                          required
                          className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, delete: !showPasswords.delete})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        >
                          {showPasswords.delete ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        Type "DELETE MY ACCOUNT" to confirm
                      </label>
                      <input
                        type="text"
                        value={deleteData.confirmation}
                        onChange={(e) => setDeleteData({...deleteData, confirmation: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                        placeholder="DELETE MY ACCOUNT"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-2 rounded-xl font-medium disabled:opacity-50"
                      >
                        {isLoading ? 'Deleting...' : 'Delete Account'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          setShowDeleteForm(false);
                          setDeleteData({ password: '', confirmation: '' });
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-medium"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserProfile;
