export const FETCH_AIRPORT_REQUEST = 'FETCH_AIRPORT_REQUEST';
export const FETCH_AIRPORT_SUCCESS = 'FETCH_AIRPORT_SUCCESS';
export const FETCH_AIRPORT_FAILURE = 'FETCH_AIRPORT_FAILURE';

export const fetchAirportRequest = (cityName) => ({
  type: FETCH_AIRPORT_REQUEST,
  payload:cityName
});

export const fetchAirportSuccess = (cities) => ({
  type: FETCH_AIRPORT_SUCCESS,
  payload: cities,
});

export const fetchAirportFailure = (error) => ({
  type: FETCH_AIRPORT_FAILURE,
  payload: error,
});
