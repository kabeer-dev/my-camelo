import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  FETCH_CITIES_REQUEST,
  fetchCitiesSuccess,
  fetchCitiesFailure,
} from "../actions/cityActions";

const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

// Fetch cities from API
function fetchCities() {
  return axios.get(
    `${API_BASE_URL}/api/method/airport_transport.api.bookings.get_city?language=eng&service=Airport Trip`
  );
}

// Handle fetch cities saga
function* fetchCitiesSaga() {
  try {
    const response = yield call(fetchCities);
    yield put(fetchCitiesSuccess(response.data));
  } catch (error) {
    yield put(fetchCitiesFailure(error.message));
  }
}

// Watch for FETCH_CITIES_REQUEST action
function* citySaga() {
  yield takeEvery(FETCH_CITIES_REQUEST, fetchCitiesSaga);
}

export default citySaga;
