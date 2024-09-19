import { call, put, takeEvery } from "redux-saga/effects";
// import axios from "axios";
import {
    GET_ZONE_REQUEST,
    getZoneSuccess,
    getZoneFailure,
} from "../actions/zoneActions";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../Api";

const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

// Handle fetch zone saga
function* fetchZoneSaga(action) {
    const { services, cityName } = action.payload;
    const language = secureLocalStorage.getItem("language");
    try {
        const response = yield call(
            axiosInstance.get,
            `${API_BASE_URL}/api/method/airport_transport.api.bookings.get_zones?service=${services}&city=${cityName}&language=${language ? language : 'eng'}`
        );
        const zones = response?.data?.data;
        if (zones) {
            yield put(getZoneSuccess(zones));
        } else {
            throw new Error("No zones data in response");
        }
    } catch (error) {
        console.error("Error fetching zones:", error); // Debugging
        yield put(getZoneFailure(error.message || 'Error fetching data'));
    }
}

// Watch for GET_ZONE_REQUEST action
function* zoneSaga() {
    yield takeEvery(GET_ZONE_REQUEST, fetchZoneSaga);
}

export default zoneSaga;
