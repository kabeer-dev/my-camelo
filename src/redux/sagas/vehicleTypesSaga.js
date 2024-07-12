import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  FETCH_VEHICLETYPES_REQUEST,
  fetchVehicleTypesSuccess,
  fetchVehicleTypesFailure,
} from "../actions/vehicleTypeAction";

const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

function fetchvehicleTypes() {
  return axios.get(
    `${API_BASE_URL}/api/method/airport_transport.api.bookings.get_vehicle_types?language=eng`
  );
}

function* fetchvehicleTypesSaga() {
  try {
    const response = yield call(fetchvehicleTypes);
    yield put(fetchVehicleTypesSuccess(response.data));
  } catch (error) {
    yield put(fetchVehicleTypesFailure(error.message));
  }
}

function* vehicleTypes() {
  yield takeEvery(FETCH_VEHICLETYPES_REQUEST, fetchvehicleTypesSaga);
}

export default vehicleTypes;
