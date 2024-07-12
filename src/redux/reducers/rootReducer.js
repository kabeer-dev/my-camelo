// src/redux/reducers/rootReducer.js
import { combineReducers } from "redux";
import cityReducer from "./cityReducer";
import airportReducer from "./airportReducer";
import vehicleTypesReducer from "./vehicleTypesReducer";
import servicesListReducer from "./servicesListReducer";
import authReducer from "./authReducer";
import loaderReducer from "./loaderReducer";
import zoneReducer from "./zoneReducer";

const rootReducer = combineReducers({
  cities: cityReducer,
  airports: airportReducer,
  vehicleTypes: vehicleTypesReducer,
  servicesList: servicesListReducer,
  auth: authReducer,
  loader: loaderReducer,
  zone: zoneReducer,
});

export default rootReducer;
