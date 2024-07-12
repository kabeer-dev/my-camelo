import {
  FETCH_VEHICLETYPES_REQUEST,
  FETCH_VEHICLETYPES_SUCCESS,
  FETCH_VEHICLETYPES_FAILURE,
} from "../actions/vehicleTypeAction";

const initialState = {
  vehicleTypes: [],
  loading: false,
  error: null,
};

const vehicleTypesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VEHICLETYPES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_VEHICLETYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        vehicleTypes: action.payload,
      };
    case FETCH_VEHICLETYPES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default vehicleTypesReducer;
