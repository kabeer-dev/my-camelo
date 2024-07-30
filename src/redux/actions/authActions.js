// authActions.js

export const SIGN_IN_REQUEST = "SIGN_IN_REQUEST";
export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export const SIGN_IN_FAILURE = "SIGN_IN_FAILURE";

export const signInRequest = (email, password, recaptchaToken, navigate) => ({
  type: SIGN_IN_REQUEST,
  payload: { email, password, recaptchaToken, navigate }
});

export const signInSuccess = (token, username, email) => ({
  type: SIGN_IN_SUCCESS,
  payload: { token, username, email },
});

export const signInFailure = (error) => ({
  type: SIGN_IN_FAILURE,
  payload: error,
});

// Sign Out
export const SIGN_OUT_REQUEST = "SIGN_OUT_REQUEST";
export const SIGN_OUT_SUCCESS = "SIGN_OUT_SUCCESS";
export const SIGN_OUT_FAILURE = "SIGN_OUT_FAILURE";

export const signOutRequest = () => ({
  type: SIGN_OUT_REQUEST,
});

export const signOutSuccess = () => ({
  type: SIGN_OUT_SUCCESS,
});

export const signOutFailure = (error) => ({
  type: SIGN_OUT_FAILURE,
  payload: error,
});

//Sign Up 
export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const signUpRequest = (values, recaptchaToken,navigate) => ({
  type: SIGN_UP_REQUEST,
  payload: { values, recaptchaToken, navigate },
});

export const signUpSuccess = (token, customer) => ({
  type: SIGN_UP_SUCCESS,
  payload: { token, customer },
});

export const signUpFailure = (error) => ({
  type: SIGN_UP_FAILURE,
  payload: error,
});

export const LANGUAGE_CHANGE = "LANGUAGE_CHANGE";
export const languageChange = (language) => ({
  type: LANGUAGE_CHANGE,
  payload: { language },
});

export const AGENT_CHANGE = "AGENT_CHANGE";
export const agentChange = (agent) => ({
  type: agent,
  payload: { agent },
});


