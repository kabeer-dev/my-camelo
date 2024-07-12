export const FETCH_SERVICESLIST_REQUEST = "FETCH_SERVICESLIST_REQUEST";
export const FETCH_SERVICESLIST_SUCCESS = "FETCH_SERVICESLIST_SUCCESS";
export const FETCH_SERVICESLIST_FAILURE = "FETCH_SERVICESLIST_FAILURE";

export const fetchServicesListRequest = (servicesListName) => ({
  type: FETCH_SERVICESLIST_REQUEST,
  payload: servicesListName,
});

export const fetchServicesListSuccess = (servicesList) => ({
  type: FETCH_SERVICESLIST_SUCCESS,
  payload: servicesList,
});

export const fetchServicesListFailure = (error) => ({
  type: FETCH_SERVICESLIST_FAILURE,
  payload: error,
});
