import { all } from "redux-saga/effects";
// Import your individual sagas here
import citySaga from "./citySaga";
import airportSaga from "./airportSaga";
import vehicleTypesSaga from "./vehicleTypesSaga";
import servicesListSaga from "./servicesListSaga";
import authSaga from "./authSaga";
import zoneSaga from "./zoneSaga";

export default function* rootSaga() {
  yield all([
    // Add your sagas here
    citySaga(),
    airportSaga(),
    vehicleTypesSaga(),
    servicesListSaga(),
    authSaga(),
    zoneSaga(),
  ]);
}
