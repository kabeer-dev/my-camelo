import {
    FETCH_AIRPORT_REQUEST,
    FETCH_AIRPORT_SUCCESS,
    FETCH_AIRPORT_FAILURE,
  } from '../actions/airportActions';
  
  const initialState = {
    airports: [],
    loading: false,
    error: null,
  };
  
  const airportReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_AIRPORT_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_AIRPORT_SUCCESS:
        return {
          ...state,
          loading: false,
          airports: action.payload,
        };
      case FETCH_AIRPORT_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default airportReducer;
  