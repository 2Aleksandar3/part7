import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create context for user state
const UserContext = createContext();

// Actions
const SET_USER = 'SET_USER';
const LOGOUT_USER = 'LOGOUT_USER';

// Reducer to manage user state
const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.user };
    case LOGOUT_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

// Initial state for user context
const initialState = { user: null };

// UserProvider to provide the state to the app
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setUser = (user) => dispatch({ type: SET_USER, user });
  const logoutUser = () => dispatch({ type: LOGOUT_USER });

  // Prevent unnecessary updates: Make sure this effect doesn't cause a loop
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <UserContext.Provider value={{ state, setUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => useContext(UserContext);
