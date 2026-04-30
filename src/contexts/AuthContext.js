import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';
import { getUserProfile, setUserProfile } from '../utils/db';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

const friendlyError = (code) => {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/requires-recent-login':
      return 'Please sign out and sign back in before making this change.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setCurrentUser({
          id:        firebaseUser.uid,
          uid:       firebaseUser.uid,
          email:     firebaseUser.email,
          firstName: profile?.firstName ?? '',
          lastName:  profile?.lastName  ?? '',
          ...profile,
        });
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      return { success: false, error: friendlyError(err.code) };
    }
  };

  const register = async ({ firstName, lastName, email, password }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await firebaseUpdateProfile(user, { displayName: `${firstName} ${lastName}` });
      await setUserProfile(user.uid, {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: friendlyError(err.code) };
    }
  };

  const logout = () => signOut(auth);

  const updateProfile = async (updates) => {
    try {
      if (!currentUser) return { success: false, error: 'Not logged in.' };
      await setUserProfile(currentUser.uid, updates);
      setCurrentUser((prev) => ({ ...prev, ...updates }));
      return { success: true };
    } catch {
      return { success: false, error: 'Profile update failed.' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (err) {
      return { success: false, error: friendlyError(err.code) };
    }
  };

  const deleteAccount = async (password) => {
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: friendlyError(err.code) };
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser, isLoading, isAuthenticated,
      login, register, logout, updateProfile, changePassword, deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
