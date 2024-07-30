// authReducer.js

import {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT_REQUEST,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LANGUAGE_CHANGE,
  AGENT_CHANGE
} from "../actions/authActions";
import secureLocalStorage from "react-secure-storage";

const language = secureLocalStorage.getItem("language");
const tokenDetails = secureLocalStorage.getItem("token");
const usernameDetails = secureLocalStorage.getItem("username");
const userEmail = secureLocalStorage.getItem("userEmail");
const agent = secureLocalStorage.getItem("agent");

const initialState = {
  language: (language && language) || 'eng',
  isLoggedIn: (tokenDetails && true) || false,
  token: tokenDetails || null,
  username: usernameDetails || null,
  email: userEmail || null,
  agent: agent || false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_REQUEST:
      return {
        ...state,
        error: null,
      };
    case SIGN_IN_SUCCESS:
      const { token, username, email } = action.payload;
      console.log('token', token)
      secureLocalStorage.setItem("token", token);
      secureLocalStorage.setItem("username", username);
      secureLocalStorage.setItem("userEmail", email);
      return {
        ...state,
        isLoggedIn: true,
        token,
        username,
        email,
        error: null,
      };
    case SIGN_IN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        error: action.payload,
      };
    case SIGN_OUT_REQUEST:
      return {
        ...state,
        error: null,
      };
    case SIGN_OUT_SUCCESS:
      secureLocalStorage.removeItem("token");
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        username: "",
        error: null,
      };
    case SIGN_OUT_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        error: action.payload,
      };
    case SIGN_UP_REQUEST:
      return {
        ...state,
        error: null,
      };
    case SIGN_UP_SUCCESS:
      secureLocalStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
        username: action.payload.customer,
        error: null,
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        error: action.payload,
      };

    case LANGUAGE_CHANGE:
      const language = action.payload.language; // Correctly access language from payload
      secureLocalStorage.setItem("language", language);
      // console.log('kkk', language); // Corrected typo 'language'
      return {
        ...state,
        language: language,
      };

    case AGENT_CHANGE:
      const agent = action.payload.language; // Correctly access language from payload
      secureLocalStorage.setItem("agent", true);
      // console.log('kkk', language); // Corrected typo 'language'
      return {
        ...state,
        agent: agent,
      };
    default:
      return state;
  }
};

export default authReducer;
