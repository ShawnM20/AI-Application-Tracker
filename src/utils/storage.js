// Local storage utilities for data persistence

const STORAGE_KEYS = {
  APPLICATIONS: 'ai_tracker_applications',
  SAVED_JOBS: 'ai_tracker_saved_jobs',
  INTERVIEW_PREP_CACHE: 'ai_tracker_interview_cache',
  USER_SETTINGS: 'ai_tracker_settings',
  REMINDERS: 'ai_tracker_reminders',
  NOTES: 'ai_tracker_notes',
  USERS: 'ai_tracker_users',
  CURRENT_USER: 'ai_tracker_current_user',
};

// Generic storage functions
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} to storage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};

// Specific storage functions
export const applicationsStorage = {
  get: () => storage.get(STORAGE_KEYS.APPLICATIONS, []),
  set: (applications) => storage.set(STORAGE_KEYS.APPLICATIONS, applications),
  add: (application) => {
    const applications = applicationsStorage.get();
    applications.push(application);
    return applicationsStorage.set(applications);
  },
  update: (id, updatedApplication) => {
    const applications = applicationsStorage.get();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index] = updatedApplication;
      return applicationsStorage.set(applications);
    }
    return false;
  },
  delete: (id) => {
    const applications = applicationsStorage.get();
    const filtered = applications.filter(app => app.id !== id);
    return applicationsStorage.set(filtered);
  }
};

export const savedJobsStorage = {
  get: () => storage.get(STORAGE_KEYS.SAVED_JOBS, []),
  set: (savedJobs) => storage.set(STORAGE_KEYS.SAVED_JOBS, savedJobs),
  toggle: (jobId) => {
    const savedJobs = savedJobsStorage.get();
    const index = savedJobs.indexOf(jobId);
    if (index > -1) {
      savedJobs.splice(index, 1);
    } else {
      savedJobs.push(jobId);
    }
    return savedJobsStorage.set(savedJobs);
  }
};

export const interviewPrepStorage = {
  get: () => storage.get(STORAGE_KEYS.INTERVIEW_PREP_CACHE, {}),
  set: (cache) => storage.set(STORAGE_KEYS.INTERVIEW_PREP_CACHE, cache),
  getCached: (jobTitle, experience) => {
    const cache = interviewPrepStorage.get();
    const key = `${jobTitle.toLowerCase()}-${experience || 'default'}`;
    return cache[key];
  },
  setCached: (jobTitle, experience, data) => {
    const cache = interviewPrepStorage.get();
    const key = `${jobTitle.toLowerCase()}-${experience || 'default'}`;
    cache[key] = {
      ...data,
      timestamp: Date.now()
    };
    return interviewPrepStorage.set(cache);
  }
};

export const settingsStorage = {
  get: () => storage.get(STORAGE_KEYS.USER_SETTINGS, {
    theme: 'default',
    notifications: true,
    defaultExperience: '',
    aiProvider: 'mock',
    openaiApiKey: '',
    autoSave: true
  }),
  set: (settings) => storage.set(STORAGE_KEYS.USER_SETTINGS, settings),
  update: (key, value) => {
    const settings = settingsStorage.get();
    settings[key] = value;
    return settingsStorage.set(settings);
  }
};

export const remindersStorage = {
  get: () => storage.get(STORAGE_KEYS.REMINDERS, []),
  set: (reminders) => storage.set(STORAGE_KEYS.REMINDERS, reminders),
  add: (reminder) => {
    const reminders = remindersStorage.get();
    reminders.push(reminder);
    return remindersStorage.set(reminders);
  },
  update: (id, updatedReminder) => {
    const reminders = remindersStorage.get();
    const index = reminders.findIndex(rem => rem.id === id);
    if (index !== -1) {
      reminders[index] = updatedReminder;
      return remindersStorage.set(reminders);
    }
    return false;
  },
  delete: (id) => {
    const reminders = remindersStorage.get();
    const filtered = reminders.filter(rem => rem.id !== id);
    return remindersStorage.set(filtered);
  }
};

export const notesStorage = {
  get: () => storage.get(STORAGE_KEYS.NOTES, []),
  set: (notes) => storage.set(STORAGE_KEYS.NOTES, notes),
  add: (note) => {
    const notes = notesStorage.get();
    notes.push(note);
    return notesStorage.set(notes);
  },
  update: (id, updatedNote) => {
    const notes = notesStorage.get();
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
      notes[index] = updatedNote;
      return notesStorage.set(notes);
    }
    return false;
  },
  delete: (id) => {
    const notes = notesStorage.get();
    const filtered = notes.filter(note => note.id !== id);
    return notesStorage.set(filtered);
  }
};

// User storage functions
export const userStorage = {
  // User management
  getUsers: () => storage.get(STORAGE_KEYS.USERS, []),
  setUsers: (users) => storage.set(STORAGE_KEYS.USERS, users),
  getCurrentUser: () => storage.get(STORAGE_KEYS.CURRENT_USER),
  setCurrentUser: (user) => storage.set(STORAGE_KEYS.CURRENT_USER, user),
  
  // User-specific data storage
  getUserData: (userId, dataType, defaultValue = null) => {
    const key = `${STORAGE_KEYS[dataType]}_${userId}`;
    return storage.get(key, defaultValue);
  },
  
  setUserData: (userId, dataType, data) => {
    const key = `${STORAGE_KEYS[dataType]}_${userId}`;
    return storage.set(key, data);
  },
  
  deleteUserData: (userId) => {
    const keysToRemove = [
      `${STORAGE_KEYS.APPLICATIONS}_${userId}`,
      `${STORAGE_KEYS.SAVED_JOBS}_${userId}`,
      `${STORAGE_KEYS.INTERVIEW_PREP_CACHE}_${userId}`,
      `${STORAGE_KEYS.USER_SETTINGS}_${userId}`,
      `${STORAGE_KEYS.REMINDERS}_${userId}`,
      `${STORAGE_KEYS.NOTES}_${userId}`,
    ];
    
    keysToRemove.forEach(key => {
      storage.remove(key);
    });
  },
  
  // User-specific application storage
  getUserApplications: (userId) => {
    return userStorage.getUserData(userId, 'APPLICATIONS', []);
  },
  
  setUserApplications: (userId, applications) => {
    return userStorage.setUserData(userId, 'APPLICATIONS', applications);
  },
  
  addUserApplication: (userId, application) => {
    const applications = userStorage.getUserApplications(userId);
    applications.push(application);
    return userStorage.setUserApplications(userId, applications);
  },
  
  updateUserApplication: (userId, id, updatedApplication) => {
    const applications = userStorage.getUserApplications(userId);
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index] = updatedApplication;
      return userStorage.setUserApplications(userId, applications);
    }
    return false;
  },
  
  deleteUserApplication: (userId, id) => {
    const applications = userStorage.getUserApplications(userId);
    const filtered = applications.filter(app => app.id !== id);
    return userStorage.setUserApplications(userId, filtered);
  },
  
  // User-specific reminders storage
  getUserReminders: (userId) => {
    return userStorage.getUserData(userId, 'REMINDERS', []);
  },
  
  setUserReminders: (userId, reminders) => {
    return userStorage.setUserData(userId, 'REMINDERS', reminders);
  },
  
  addUserReminder: (userId, reminder) => {
    const reminders = userStorage.getUserReminders(userId);
    reminders.push(reminder);
    return userStorage.setUserReminders(userId, reminders);
  },
  
  updateUserReminder: (userId, id, updatedReminder) => {
    const reminders = userStorage.getUserReminders(userId);
    const index = reminders.findIndex(rem => rem.id === id);
    if (index !== -1) {
      reminders[index] = updatedReminder;
      return userStorage.setUserReminders(userId, reminders);
    }
    return false;
  },
  
  deleteUserReminder: (userId, id) => {
    const reminders = userStorage.getUserReminders(userId);
    const filtered = reminders.filter(rem => rem.id !== id);
    return userStorage.setUserReminders(userId, filtered);
  },
  
  // User-specific notes storage
  getUserNotes: (userId) => {
    return userStorage.getUserData(userId, 'NOTES', []);
  },
  
  setUserNotes: (userId, notes) => {
    return userStorage.setUserData(userId, 'NOTES', notes);
  },
  
  addUserNote: (userId, note) => {
    const notes = userStorage.getUserNotes(userId);
    notes.push(note);
    return userStorage.setUserNotes(userId, notes);
  },
  
  updateUserNote: (userId, id, updatedNote) => {
    const notes = userStorage.getUserNotes(userId);
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
      notes[index] = updatedNote;
      return userStorage.setUserNotes(userId, notes);
    }
    return false;
  },
  
  deleteUserNote: (userId, id) => {
    const notes = userStorage.getUserNotes(userId);
    const filtered = notes.filter(note => note.id !== id);
    return userStorage.setUserNotes(userId, filtered);
  },
  
  // User-specific saved jobs storage
  getUserSavedJobs: (userId) => {
    return userStorage.getUserData(userId, 'SAVED_JOBS', []);
  },
  
  setUserSavedJobs: (userId, savedJobs) => {
    return userStorage.setUserData(userId, 'SAVED_JOBS', savedJobs);
  },
  
  // User-specific settings storage
  getUserSettings: (userId) => {
    return userStorage.getUserData(userId, 'USER_SETTINGS', {
      theme: 'purple',
      darkMode: false,
      notifications: true,
      defaultExperience: '',
      aiProvider: 'mock',
      openaiApiKey: '',
      autoSave: true
    });
  },
  
  setUserSettings: (userId, settings) => {
    return userStorage.setUserData(userId, 'USER_SETTINGS', settings);
  },
  
  updateUserSettings: (userId, key, value) => {
    const settings = userStorage.getUserSettings(userId);
    settings[key] = value;
    return userStorage.setUserSettings(userId, settings);
  },
  
  // User-specific interview prep cache
  getUserInterviewCache: (userId) => {
    return userStorage.getUserData(userId, 'INTERVIEW_PREP_CACHE', {});
  },
  
  setUserInterviewCache: (userId, cache) => {
    return userStorage.setUserData(userId, 'INTERVIEW_PREP_CACHE', cache);
  },
  
  getCachedInterviewPrep: (userId, jobTitle, experience) => {
    const cache = userStorage.getUserInterviewCache(userId);
    const key = `${jobTitle.toLowerCase()}-${experience || 'default'}`;
    return cache[key];
  },
  
  setCachedInterviewPrep: (userId, jobTitle, experience, data) => {
    const cache = userStorage.getUserInterviewCache(userId);
    const key = `${jobTitle.toLowerCase()}-${experience || 'default'}`;
    cache[key] = {
      ...data,
      timestamp: Date.now()
    };
    return userStorage.setUserInterviewCache(userId, cache);
  },
};

// Migrate existing data to user-specific format (for backward compatibility)
export const migrateToUserSpecific = (userId) => {
  try {
    // Get existing global data
    const existingApplications = applicationsStorage.get();
    const existingReminders = remindersStorage.get();
    const existingNotes = notesStorage.get();
    const existingSettings = settingsStorage.get();
    const existingSavedJobs = savedJobsStorage.get();
    const existingInterviewCache = interviewPrepStorage.get();
    
    // Move to user-specific storage
    if (existingApplications.length > 0) {
      userStorage.setUserApplications(userId, existingApplications);
    }
    
    if (existingReminders.length > 0) {
      userStorage.setUserReminders(userId, existingReminders);
    }
    
    if (existingNotes.length > 0) {
      userStorage.setUserNotes(userId, existingNotes);
    }
    
    if (existingSavedJobs.length > 0) {
      userStorage.setUserSavedJobs(userId, existingSavedJobs);
    }
    
    if (Object.keys(existingInterviewCache).length > 0) {
      userStorage.setUserInterviewCache(userId, existingInterviewCache);
    }
    
    if (Object.keys(existingSettings).length > 0) {
      userStorage.setUserSettings(userId, existingSettings);
    }
    
    // Clear global storage
    storage.remove(STORAGE_KEYS.APPLICATIONS);
    storage.remove(STORAGE_KEYS.REMINDERS);
    storage.remove(STORAGE_KEYS.NOTES);
    storage.remove(STORAGE_KEYS.SAVED_JOBS);
    storage.remove(STORAGE_KEYS.INTERVIEW_PREP_CACHE);
    storage.remove(STORAGE_KEYS.USER_SETTINGS);
    
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};
