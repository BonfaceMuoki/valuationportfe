import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, Autocomplete, Marker, useJsApiLoader } from "@react-google-maps/api";
import { setGpsDetails, selectGPSDetails } from "../../featuers/authSlice";
const libraries = ["places"];
const MapWithAutoSearch = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBjVd1WBin9lU7BW0N0AujyyL0jMGKgkQ4",
    loading: "async",
    libraries,
  });
  const gpsd = useSelector(selectGPSDetails);
  const [center, setCenter] = useState({ lat: 36.89925, lng: -1.22468 });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markers, setMarkers] = useState([]);
  const autocompleteRef = useRef(null);
  const dispatch = useDispatch();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (gpsd != null && (gpsd.type === "custom" || gpsd.type === "auto")) {
      const { lat, long } = gpsd.details;
      setCenter({ lat, lng: long });
    }
  }, [gpsd]);

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
    setMapLoaded(true);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        dispatch(
          setGpsDetails({
            type: "auto",
            details: {
              lat: place.geometry.location.lat(),
              long: place.geometry.location.lng(),
              name: place.name,
              formatted_address: place.formatted_address,
            },
          })
        );
        setSelectedPlace(place);
      }
    }
  };

  const onMapClick = (event) => {
    const { latLng } = event;
    const latitude = latLng.lat();
    const longitude = latLng.lng();

    dispatch(
      setGpsDetails({
        type: "auto",
        details: {
          lat: latitude,
          long: longitude,
          name: "Custom Picked Name",
          formatted_address: "Custom Picked Name",
        },
      })
    );

    setSelectedPlace({
      name: "Custom Picked Name",
      geometry: {
        location: {
          lat: () => latitude,
          lng: () => longitude,
        },
      },
    });
    if (mapLoaded)
      setMarkers([
        {
          name: "Custom Location",
          position: { lat: latitude, lng: longitude },
          icon: "https://maps.google.com/mapfiles/kml/paddle/blu-circle.png",
        },
      ]);
  };

  return isLoaded ? (
    <>
      <GoogleMap mapContainerStyle={{ width: "100%", height: "200px" }} center={center} zoom={15} onClick={onMapClick}>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={marker.icon} onClick={() => setSelectedPlace(marker)} />
        ))}

        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter a location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `500px`,
              height: `50px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px",
              marginTop: "5px",
            }}
          />
        </Autocomplete>
      </GoogleMap>
      {gpsd != null && (
        <div style={{ marginTop: "10px" }}>
          <h2>Selected Location:</h2>
          <p>Name: {gpsd.details.name}</p>
          <p>Latitude: {gpsd.details.lat}</p>
          <p>Longitude: {gpsd.details.long}</p>
        </div>
      )}
    </>
  ) : (
    <></>
  );
};

export default MapWithAutoSearch;
