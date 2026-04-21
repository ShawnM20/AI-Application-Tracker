import React, { createContext, useContext, useState, useEffect } from 'react';
import { userStorage } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = userStorage.getCurrentUser();
        if (savedUser) {
          setCurrentUser(savedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Get all users
      const users = userStorage.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        userStorage.setCurrentUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      const users = userStorage.getUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'User with this email already exists' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      // Save user
      users.push(newUser);
      userStorage.setUsers(users);
      
      // Auto login
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      userStorage.setCurrentUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      setCurrentUser(null);
      setIsAuthenticated(false);
      userStorage.setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!currentUser) return { success: false, error: 'No user logged in' };
      
      const users = userStorage.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }
      
      // Update user
      const updatedUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      users[userIndex] = updatedUser;
      userStorage.setUsers(users);
      
      setCurrentUser(updatedUser);
      userStorage.setCurrentUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: 'Profile update failed' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!currentUser) return { success: false, error: 'No user logged in' };
      
      const users = userStorage.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }
      
      // Verify current password
      if (users[userIndex].password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }
      
      // Update password
      users[userIndex].password = newPassword;
      users[userIndex].updatedAt = new Date().toISOString();
      
      userStorage.setUsers(users);
      
      return { success: true };
    } catch (error) {
      console.error('Password change failed:', error);
      return { success: false, error: 'Password change failed' };
    }
  };

  const deleteAccount = async (password) => {
    try {
      if (!currentUser) return { success: false, error: 'No user logged in' };
      
      const users = userStorage.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }
      
      // Verify password
      if (users[userIndex].password !== password) {
        return { success: false, error: 'Password is incorrect' };
      }
      
      // Remove user
      users.splice(userIndex, 1);
      userStorage.setUsers(users);
      
      // Delete all user data
      userStorage.deleteUserData(currentUser.id);
      
      // Logout
      setCurrentUser(null);
      setIsAuthenticated(false);
      userStorage.setCurrentUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Account deletion failed:', error);
      return { success: false, error: 'Account deletion failed' };
    }
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
