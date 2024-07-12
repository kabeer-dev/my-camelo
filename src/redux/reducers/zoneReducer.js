import {
    GET_ZONE_REQUEST,
    GET_ZONE_SUCCESS,
    GET_ZONE_FAILURE,
  } from '../actions/zoneActions';
  
  const initialState = {
    zone: [],
    loading: false,
    error: null,
  };
  
  const zoneReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ZONE_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case GET_ZONE_SUCCESS:
        return {
          ...state,
          loading: false,
          zone: action.payload,
        };
      case GET_ZONE_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default zoneReducer;
  