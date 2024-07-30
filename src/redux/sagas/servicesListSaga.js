import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  FETCH_SERVICESLIST_REQUEST,
  fetchServicesListSuccess,
  fetchServicesListFailure,
} from "../actions/servicesListActions";
import secureLocalStorage from "react-secure-storage";

const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

// Fetch cities from API
function fetchServicesList() {
  const language = secureLocalStorage.getItem("language");
  return axios.get(
    `${API_BASE_URL}/api/method/airport_transport.api.bookings.get_services?language=${language ? (language === 'eng' ? 'en' : language) : 'en'}`
  );
}

// Handle fetch cities saga
function* fetchServicesListSaga() {
  try {
    const response = yield call(fetchServicesList);
    yield put(fetchServicesListSuccess(response.data));
  } catch (error) {
    yield put(fetchServicesListFailure(error.message));
  }
}

// Watch for FETCH_SERVICESLIST_REQUEST action
function* servicesListSaga() {
  yield takeEvery(FETCH_SERVICESLIST_REQUEST, fetchServicesListSaga);
}

export default servicesListSaga;
