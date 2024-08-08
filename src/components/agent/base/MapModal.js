import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Polygon, StandaloneSearchBox } from "@react-google-maps/api";
import axios from "axios";
import { setLoading } from "../../../redux/actions/loaderAction";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function MapModal({ rideName, formValues, onSubmitDestination, zoneCoords, cityName, setLocation, setDestination }) {
  const [t, i18n] = useTranslation("global")
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [error, setError] = useState("");
  const [searchBox, setSearchBox] = useState(null); // State to hold the StandaloneSearchBox instance

  const mapRef = useRef(null);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  let center;
  if (cityName === t("hero.dammam_text")) {
    if (selectedPickup) {
      center = selectedPickup
    } else if (selectedDropoff) {
      center = selectedDropoff
    } else {
      center = {
        lat: 26.3927,
        lng: 49.9777,
      };
    }

  }
  if (cityName === t("hero.riyadh_text")) {
    if (selectedPickup) {
      center = selectedPickup
    } else if (selectedDropoff) {
      center = selectedDropoff
    } else {
      center = {
        lng: 46.6753,
        lat: 24.7136
      }
    }

  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
  };


  const convertedCoords = zoneCoords.map((coord) => ((
    coord.map.map((coo) => ({
      lat: coo[0],
      lng: coo[1],
    }))

  )));

  // let convertedCoords2 = null;
  // if (zoneCoords2 !== null) {
  //   convertedCoords2 = zoneCoords.map((coord) => ({
  //     lat: coord[0],
  //     lng: coord[1],
  //   }));
  // }
  useEffect(() => {
    const setPickOrDrop = async () => {
      if (rideName === "airportRide") {
        dispatch(setLoading(true))
        let point;
        const apiKey = "AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU";
        const encodedAddress = encodeURIComponent(`${formValues.airportName} ${formValues.terminalNumber}`); // Encode the address
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
        try {
          const response = await axios.get(url);
          const location = response.data.results[0].geometry.location;
          const latitude = location.lat;
          const longitude = location.lng;
          point = { lat: latitude, lng: longitude };

        } catch (error) {
          console.error('Error fetching location:', error.message);
        }
        if (cityName === t("hero.dammam_text")) {
          const Dammampoint = { lat: 26.3927, lng: 49.9777 };
          if (formValues.rideType === t("hero.pickup_value_text")) {
            setLocation(`${formValues.airportName} ${formValues.terminalNumber} ${formValues.arrivalCity} Saudi Arabia`)
            setSelectedPickup(point);
          } else if (formValues.rideType === t("hero.dropoff_value_text")) {
            setDestination(`${formValues.airportName} ${formValues.terminalNumber} ${formValues.arrivalCity} Saudi Arabia`)
            setSelectedDropoff(point);
          }
        } else {
          const Riyadhpoint = { lng: 46.6753, lat: 24.7136 };
          if (formValues.rideType === t("hero.pickup_value_text")) {
            setLocation(`${formValues.airportName} ${formValues.terminalNumber} ${formValues.arrivalCity} Saudi Arabia`)
            setSelectedPickup(point);
          } else if (formValues.rideType === t("hero.dropoff_value_text")) {
            setDestination(`${formValues.airportName} ${formValues.terminalNumber} ${formValues.arrivalCity} Saudi Arabia`)
            setSelectedDropoff(point);
          }
        }
        dispatch(setLoading(false))
      }
    }
    setPickOrDrop()
  }, [rideName, cityName, formValues.rideType]);

  const isPointInPolygon = (point, polygon, index) => {
    const { lat, lng } = point;
    let inside = false;
    if (index) {
      for (let i = 0, j = polygon[index].length - 1; i < polygon[index].length; j = i++) {
        const xi = polygon[index][i].lat,
          yi = polygon[index][i].lng;
        const xj = polygon[index][j].lat,
          yj = polygon[index][j].lng;

        const intersect =
          yi > lng !== yj > lng &&
          lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    } else {
      for (let i = 0, j = polygon[0].length - 1; i < polygon[0].length; j = i++) {
        const xi = polygon[0][i].lat,
          yi = polygon[0][i].lng;
        const xj = polygon[0][j].lat,
          yj = polygon[0][j].lng;

        const intersect =
          yi > lng !== yj > lng &&
          lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }

  };

  const onMapClick = async (event, index) => {

    // if (index) {
    const point = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    if (isPointInPolygon(point, convertedCoords, index)) {
      console.log('poly')
      setError("");
      dispatch(setLoading(true))
      if (rideName === "airportRide") {
        // if (formValues.rideType === t("hero.dropoff_value_text")) {
        //   const apiKey = "AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU";
        //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&key=${apiKey}`;

        //   try {
        //     const response = await axios.get(url);
        //     const location = response.data.results[0].formatted_address;
        //     // console.log('Location:', location);
        //     setLocation(`${location} Saudi Arabia`);
        //   } catch (error) {
        //     console.error('Error fetching location:', error.message);
        //   }
        //   setSelectedPickup(point);
        // } else {
        //   const apiKey = "AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU";
        //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&key=${apiKey}`;

        //   try {
        //     const response = await axios.get(url);
        //     const location = response.data.results[0].formatted_address;
        //     // console.log('Location:', location);

        //     setDestination(`${location} Saudi Arabia`);
        //   } catch (error) {
        //     console.error('Error fetching location:', error.message);
        //   }
        //   setSelectedDropoff(point);
        // }
        if (formValues.rideType === t("hero.dropoff_value_text")) {
          if (!selectedPickup) {
            const apiKey = "AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU";
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&key=${apiKey}`;

            try {
              const response = await axios.get(url);
              const location = response.data.results[0].formatted_address;
              // console.log('Location:', location);
              setLocation(`${location} Saudi Arabia`);
              setSelectedPickup(point);
            } catch (error) {
              console.error('Error fetching location:', error.message);
            }

          }
        } else {
          if (!selectedPickup) {
            const apiKey = "AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU";
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&key=${apiKey}`;

            try {
              const response = await axios.get(url);
              const location = response.data.results[0].formatted_address;
              // console.log('Location:', location);
              setLocation(`${location} Saudi Arabia`);
              setSelectedPickup(point);
            } catch (error) {
              console.error('Error fetching location:', error.message);
            }

          } else {
            const apiKey = "AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU";
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&key=${apiKey}`;

            try {
              const response = await axios.get(url);
              const location = response.data.results[0].formatted_address;
              // console.log('Location:', location);
              setDestination(`${location} Saudi Arabia`);
              setSelectedDropoff(point);
            } catch (error) {
              console.error('Error fetching location:', error.message);
            }

          }
        }

      } else if (rideName === "scheduledRide") {
        if (!selectedPickup) {
          const apiKey = "AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU";
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&key=${apiKey}`;

          try {
            const response = await axios.get(url);
            const location = response.data.results[0].formatted_address;
            // console.log('Location:', location);
            setLocation(`${location} Saudi Arabia`);
            setSelectedPickup(point);
          } catch (error) {
            console.error('Error fetching location:', error.message);
          }

        } else {
          const apiKey = "AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU";
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&key=${apiKey}`;

          try {
            const response = await axios.get(url);
            const location = response.data.results[0].formatted_address;
            // console.log('Location:', location);
            setDestination(`${location} Saudi Arabia`);
            setSelectedDropoff(point);
          } catch (error) {
            console.error('Error fetching location:', error.message);
          }

        }
      } else {
        // if (!selectedPickup) {
        const apiKey = "AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&key=${apiKey}`;

        try {
          const response = await axios.get(url);
          const location = response.data.results[0].formatted_address;
          // console.log('Location:', location);
          setLocation(`${location} Saudi Arabia`);
        } catch (error) {
          console.error('Error fetching location:', error.message);
        }
        setSelectedPickup(point);
        // }
      }
    } else {
      setError(`You cannot select a location outside the ${cityName === t("hero.riyadh_text") ? 'Riyadh' : 'Dammam'} zone.`);
    }
    // }
    // else {
    //   setError("You cannot select a location outside the Dammam zone.");
    // }
    dispatch(setLoading(false))
  };

  function submitDestination() {
    if (rideName === "airportRide" || rideName === "scheduledRide") {
      if (selectedPickup && selectedDropoff) {
        onSubmitDestination(selectedPickup, selectedDropoff);
        closeModal();
      } else {
        setError("Please select both pickup and dropoff locations.");
      }
    } else {
      if (selectedPickup) {
        onSubmitDestination(selectedPickup, null);
        closeModal();
      } else {
        setError("Please select pickup location.");
      }
    }

  }

  const onLoad = (ref) => {
    mapRef.current = ref;
  };

  const onSearchBoxLoad = (ref) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    const place = places[0];

    if (place.geometry && place.geometry.location) {
      mapRef.current.panTo(place.geometry.location);
      mapRef.current.setZoom(14); // Adjust the zoom level as needed
    }
  };

  const mapOptions = {
    streetViewControl: false, // Hides the Street View control
    // zoomControl: false,
    fullscreenControl: false,
  }

  return (
    <>
      <button
        onClick={openModal}
        className="block w-full bg-background_steel_blue text-text_white text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        {t("hero.set_on_map_text")}
      </button>

      {isModalOpen && (
        <div
          id="extralarge-modal"
          tabIndex="-1"
          className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50"
        >
          <div className="relative w-full max-w-7xl max-h-full">
            <div className="relative bg-background_steel_blue rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600">
                <h3 className="text-xl text-text_white font-medium text-gray-900 dark:text-white">
                  {t("hero.set_destination_text")}
                </h3>
                <button
                  onClick={closeModal}
                  type="button"
                  className="text-gray-400 bg-transparent text-text_white hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="extralarge-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <LoadScript
                  googleMapsApiKey="AIzaSyBMTLXpuXtkEfbgChZzsj7LPYlpGxHI9iU"
                  libraries={["places"]}
                >
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                    onClick={(event) => onMapClick(event, null)}
                    options={mapOptions}
                  >
                    {/* Your existing map components */}
                    {convertedCoords.map((convertedCod, index) => (
                      <Polygon
                        paths={convertedCod}
                        options={{
                          fillColor: "#4463F0",
                          fillOpacity: 0.3,
                          strokeColor: "#355E3B",
                          strokeOpacity: 1,
                          strokeWeight: 1,
                        }}
                        onClick={(event) => onMapClick(event, index)}
                      />
                    ))}


                    {/* <Polygon
                      paths={convertedCoords2}
                      options={{
                        fillColor: "#4463F0",
                        fillOpacity: 0.3,
                        strokeColor: "#355E3B",
                        strokeOpacity: 1,
                        strokeWeight: 1,
                      }}
                      onClick={onMapClick}
                    /> */}

                    {/* <Polygon
                      paths={[
                        { lat: 90, lng: -180 },
                        { lat: -90, lng: -180 },
                        { lat: -90, lng: 180 },
                        { lat: 90, lng: 180 },
                      ]}
                      options={{
                        fillColor: "#000000",
                        fillOpacity: 0.5,
                        strokeColor: "#355E3B",
                        strokeOpacity: 0.5,
                        strokeWeight: 1,
                      }}
                    /> */}

                    {selectedPickup && <Marker position={selectedPickup} label={t("hero.pickup_text")} icon={{ url: '/assets/map/pickup.png' }}
                      onClick={() => setSelectedPickup(null)} />}
                    {selectedDropoff && <Marker position={selectedDropoff} label={t("hero.dropoff_text")} icon={{ url: '/assets/map/dropoff.png' }}
                      onClick={() => {
                        if (!rideName === "airportRide" && !formValues.rideType === t("hero.dropoff_value_text")) {
                          setSelectedDropoff(null)
                        }
                      }} />}

                    {/* Standalone Search Box */}
                    <StandaloneSearchBox
                      onLoad={onSearchBoxLoad}
                      onPlacesChanged={onPlacesChanged}
                    >
                      <input
                        type="text"
                        placeholder="Search for a place"
                        style={{
                          boxSizing: `border-box`,
                          border: `1px solid transparent`,
                          width: `240px`,
                          height: `40px`,
                          padding: `0 12px`,
                          borderRadius: `3px`,
                          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                          fontSize: `14px`,
                          outline: `none`,
                          textOverflow: `hidden`,
                          position: "relative",
                          left: "50%",
                          marginLeft: "-120px",
                          top: "10px",
                          zIndex: 1
                        }}
                      />
                    </StandaloneSearchBox>
                  </GoogleMap>
                </LoadScript>

              </div>
              {error && <div className="p-4 text-text_warning">{error}</div>}
              <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={submitDestination}
                  type="button"
                  className="text-background_steel_blue border bg-text_white border-text_white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {t("hero.confirm_destination_text")}
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium rounded-lg border border-background_white text-background_white"
                >
                  {t("hero.decline_text")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
