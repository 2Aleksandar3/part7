import React, { createContext, useReducer, useContext } from 'react';

// Define the action types
const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

// Define the initial state
const initialState = {
  message: '',
  type: '', // Example: 'success', 'error', etc.
  isVisible: false,
};

// Define the reducer function to manage the state
function notificationReducer(state, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        message: action.payload.message,
        type: action.payload.type,
        isVisible: true,
      };
    case HIDE_NOTIFICATION:
      return { ...state, isVisible: false };
    default:
      return state;
  }
}

// Create the context
const NotificationContext = createContext();

// Create a custom hook to use the context
export function useNotification() {
  return useContext(NotificationContext);
}

// Create the provider component
export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Action creators
  const showNotification = (message, type) => {
    dispatch({
      type: SHOW_NOTIFICATION,
      payload: { message, type },
    });
  };

  const hideNotification = () => {
    dispatch({ type: HIDE_NOTIFICATION });
  };

  return (
    <NotificationContext.Provider
      value={{ state, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
