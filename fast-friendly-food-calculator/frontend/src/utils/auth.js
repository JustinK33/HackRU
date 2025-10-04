// Authentication utilities
const USERS_KEY = 'macrave_users';
const CURRENT_USER_KEY = 'macrave_current_user';

// Get all stored users
export const getStoredUsers = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (error) {
    console.error('Error getting stored users:', error);
    return {};
  }
};

// Store all users
export const storeUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error storing users:', error);
  }
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Set current user
export const setCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

// Register a new user
export const registerUser = (userData) => {
  const users = getStoredUsers();
  const { username } = userData;
  
  if (users[username]) {
    throw new Error('Username already exists');
  }
  
  const newUser = {
    ...userData,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  
  users[username] = newUser;
  storeUsers(users);
  setCurrentUser(newUser);
  
  return newUser;
};

// Login user
export const loginUser = (username, password) => {
  const users = getStoredUsers();
  const user = users[username];
  
  if (!user) {
    throw new Error('Username not found');
  }
  
  if (user.password !== password) {
    throw new Error('Incorrect password');
  }
  
  setCurrentUser(user);
  return user;
};

// Logout user
export const logoutUser = () => {
  setCurrentUser(null);
};

// Check if user is logged in
export const isLoggedIn = () => {
  return getCurrentUser() !== null;
};
