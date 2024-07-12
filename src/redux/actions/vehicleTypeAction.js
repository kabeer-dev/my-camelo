export const FETCH_VEHICLETYPES_REQUEST = "FETCH_VEHICLETYPES_REQUEST";
export const FETCH_VEHICLETYPES_SUCCESS = "FETCH_VEHICLETYPES_SUCCESS";
export const FETCH_VEHICLETYPES_FAILURE = "FETCH_VEHICLETYPES_FAILURE";

export const fetchVehicleTypesRequest = () => ({
  type: FETCH_VEHICLETYPES_REQUEST,
});

export const fetchVehicleTypesSuccess = (cities) => ({
  type: FETCH_VEHICLETYPES_SUCCESS,
  payload: cities,
});

export const fetchVehicleTypesFailure = (error) => ({
  type: FETCH_VEHICLETYPES_FAILURE,
  payload: error,
});
