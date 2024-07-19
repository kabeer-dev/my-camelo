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
} from "../actions/authActions";
import secureLocalStorage from "react-secure-storage";

const tokenDetails = secureLocalStorage.getItem("token");
const usernameDetails = secureLocalStorage.getItem("username");
const initialState = {
  isLoggedIn: (tokenDetails && true) || false,
  token: tokenDetails || null,
  username: usernameDetails || null,
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
      const { token, username } = action.payload;
      console.log('token', token)
      secureLocalStorage.setItem("token", token);
      secureLocalStorage.setItem("username", username);
      return {
        ...state,
        isLoggedIn: true,
        token,
        username,
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
    default:
      return state;
  }
};

export default authReducer;
