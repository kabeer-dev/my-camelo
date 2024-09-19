// authSaga.js

import { takeEvery, put, all } from "redux-saga/effects";
// import axios from "axios";
import {
  SIGN_IN_REQUEST,
  SIGN_OUT_REQUEST,
  SIGN_UP_REQUEST,
  signInSuccess,
  signOutSuccess,
  signUpSuccess,
  signInFailure,
  signOutFailure,
  signUpFailure,
  languageChange
} from "../actions/authActions";
import { message } from "antd";
import { setLoading } from "../actions/loaderAction";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../Api";

const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

function* signInSaga(action) {
  yield put(setLoading(true));
  const { email, password, recaptchaToken, navigate } = action.payload;
  const headers = {
    "Content-Type": "application/json",
    recaptchaToken: recaptchaToken,
  };
  try {
    const response = yield axiosInstance.post(`${API_BASE_URL}/api/method/airport_transport.api.user.detect_email?email=${email}`);
    if (response && response.status === 200) {
      // console.log('ggg', response.data.msg);
      if (response.data.msg === 'Transport User') {
        const signinResponse = yield axiosInstance.post(
          `${API_BASE_URL}/api/method/airport_transport.api.user.login`,
          { usr: email, pwd: password },
          { headers: headers }
        );
        const { token, username } = signinResponse.data.data;
        const getEmail = signinResponse.data.data.email
        let photo = ""
        yield put(signInSuccess(token, username, getEmail, photo));
        yield put(setLoading(false));
        // Navigate to the home page on successful sign-in
        if (navigate) {
          navigate("/mashrouk-new-ui/");
        }
      } else {
        const agentData = {
          usr: email,
          pwd: password
        }
        const agentResponse = yield axiosInstance.post(
          `${API_BASE_URL}/api/method/airport_transport.api.agent.login`, agentData);
        // console.log('aaa', agentResponse)
        const { token, username } = agentResponse.data.data;
        const getEmail = agentResponse.data.data.email
        const photo = agentResponse.data.data.photo
        yield put(signInSuccess(token, username, getEmail, photo));
        secureLocalStorage.setItem("agent", true);
        yield put(setLoading(false));
        if (navigate) {
          navigate("/mashrouk-new-ui/agent");
        }
      }
    }
  } catch (error) {
    yield put(signInFailure(error.response.data.msg));
    yield put(setLoading(false));
    message.error(`${error?.response?.data?.msg}`);
  }
}

function* signUpSaga(action) {
  yield put(setLoading(true));
  const { values, recaptchaToken, navigate } = action.payload;
  const language = secureLocalStorage.getItem("language");
  const headers = {
    "Content-Type": "application/json",
    recaptchaToken: recaptchaToken,
  };
  try {
    const response = yield axiosInstance.post(
      `${API_BASE_URL}/api/method/airport_transport.api.user.register`,
      values,
      { headers: headers }
    );
    const { customer, token } = response?.data?.data;
    yield put(signUpSuccess(token, customer));
    yield put(setLoading(false));
    // Navigate to the home page on successful sign-in
    if (navigate) {
      navigate("/mashrouk-new-ui/");
    }
  } catch (error) {
    yield put(signUpFailure(error?.response?.data?.msg));
    yield put(setLoading(false));
    message.error(`${error?.response?.data?.msg}`);
  }
}

function* signOutSaga() {
  try {
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error.response.data.msg));
    message.error(`${error?.response?.data?.msg}`);
  }
}

function* watchSignIn() {
  yield takeEvery(SIGN_IN_REQUEST, signInSaga);
}

function* watchSignOut() {
  yield takeEvery(SIGN_OUT_REQUEST, signOutSaga);
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUpSaga);
}

export default function* authSaga() {
  yield all([watchSignIn(), watchSignOut(), watchSignUp()]);
}
