export const GET_ZONE_REQUEST = 'GET_ZONE_REQUEST';
export const GET_ZONE_SUCCESS = 'GET_ZONE_SUCCESS';
export const GET_ZONE_FAILURE = 'GET_ZONE_FAILURE';

export const getZoneRequest = (services, cityName) => ({
  type: GET_ZONE_REQUEST,
  payload: { services, cityName }
});

export const getZoneSuccess = (zones) => ({
  type: GET_ZONE_SUCCESS,
  payload: zones,
});

export const getZoneFailure = (error) => ({
  type: GET_ZONE_FAILURE,
  payload: error,
});
