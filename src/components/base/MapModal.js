import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Polygon, StandaloneSearchBox } from "@react-google-maps/api";

export default function MapModal({ onSubmitDestination, dammamZoneCoords }) {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 26.3927,
    lng: 49.9777,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [error, setError] = useState("");
  const [searchBox, setSearchBox] = useState(null); // State to hold the StandaloneSearchBox instance

  const mapRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
  };

  const convertedCoords = dammamZoneCoords.map((coord) => ({
    lat: coord[0],
    lng: coord[1],
  }));

  const isPointInPolygon = (point, polygon) => {
    const { lat, lng } = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat,
        yi = polygon[i].lng;
      const xj = polygon[j].lat,
        yj = polygon[j].lng;

      const intersect =
        yi > lng !== yj > lng &&
        lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const onMapClick = (event) => {
    const point = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    if (isPointInPolygon(point, convertedCoords)) {
      setError("");
      if (!selectedPickup) {
        setSelectedPickup(point);
      } else if (!selectedDropoff) {
        setSelectedDropoff(point);
      }
    } else {
      setError("You cannot select a location outside the Dammam zone.");
    }
  };

  function submitDestination() {
    if (selectedPickup && selectedDropoff) {
      onSubmitDestination(selectedPickup, selectedDropoff);
      closeModal();
    } else {
      setError("Please select both pickup and dropoff locations.");
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

  return (
    <>
      <button
        onClick={openModal}
        className="block w-full bg-background_steel_blue text-text_white text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Set on the map
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
                  Select Your Destination
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
                    onClick={onMapClick}
                  >
                    {/* Your existing map components */}
                    <Polygon
                      paths={convertedCoords}
                      options={{
                        fillColor: "#4463F0",
                        fillOpacity: 0.3,
                        strokeColor: "#355E3B",
                        strokeOpacity: 1,
                        strokeWeight: 1,
                      }}
                    />
                    <Polygon
                      paths={[
                        { lat: 90, lng: -180 },
                        { lat: -90, lng: -180 },
                        { lat: -90, lng: 180 },
                        { lat: 90, lng: 180 },
                      ]}
                      options={{
                        fillColor: "#4463F0",
                        fillOpacity: 0.3,
                        strokeColor: "#355E3B",
                        strokeOpacity: 1,
                        strokeWeight: 1,
                      }}
                    />

                    {selectedPickup && <Marker position={selectedPickup} />}
                    {selectedDropoff && <Marker position={selectedDropoff} />}

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
                          textOverflow: `ellipses`,
                          position: "absolute",
                          left: "50%",
                          marginLeft: "-120px",
                          top: "10px",
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
                  Confirm Your Destination
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium rounded-lg border border-background_white text-background_white"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
