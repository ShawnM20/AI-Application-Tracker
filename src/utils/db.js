import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';

// ─── User profile ─────────────────────────────────────────────────
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const setUserProfile = async (uid, data) => {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
};

// ─── Applications (real-time) ─────────────────────────────────────
// Returns an unsubscribe function. Calls callback with the full array on any change.
export const subscribeToApplications = (uid, callback) => {
  return onSnapshot(
    collection(db, 'users', uid, 'applications'),
    (snapshot) => {
      const apps = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort newest-first client-side (avoids needing a Firestore composite index)
      apps.sort((a, b) => new Date(b.date) - new Date(a.date));
      callback(apps);
    },
    (error) => {
      console.error('Applications listener error:', error);
    }
  );
};

export const addApplication = async (uid, app) => {
  const ref = doc(db, 'users', uid, 'applications', app.id);
  await setDoc(ref, { ...app, notes: app.notes || [], createdAt: serverTimestamp() });
};

export const updateApplication = async (uid, appId, data) => {
  const ref = doc(db, 'users', uid, 'applications', appId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
};

export const deleteApplication = async (uid, appId) => {
  await deleteDoc(doc(db, 'users', uid, 'applications', appId));
};

// ─── Notes (embedded inside the application document) ────────────
export const addNoteToApplication = async (uid, appId, note) => {
  const ref = doc(db, 'users', uid, 'applications', appId);
  await updateDoc(ref, { notes: arrayUnion(note) });
};

// ─── Settings ─────────────────────────────────────────────────────
export const getSettings = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid, 'settings', 'preferences'));
  return snap.exists() ? snap.data() : {};
};

export const saveSettings = async (uid, settings) => {
  await setDoc(doc(db, 'users', uid, 'settings', 'preferences'), settings, { merge: true });
};
