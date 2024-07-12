import {
  FETCH_SERVICESLIST_REQUEST,
  FETCH_SERVICESLIST_SUCCESS,
  FETCH_SERVICESLIST_FAILURE,
} from "../actions/servicesListActions";

const initialState = {
  servicesList: [],
  loading: false,
  error: null,
};

const servicesListReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SERVICESLIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_SERVICESLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        servicesList: action.payload,
      };
    case FETCH_SERVICESLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default servicesListReducer;
