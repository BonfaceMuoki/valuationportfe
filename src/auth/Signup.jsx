import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { useRequestUploaderAccessMutation } from "../api/auth/inviteValuerApiSlice";
import { Row, Col, Spinner } from "reactstrap";
import { LoadingOverlay } from '../components/Component';

import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../components/Component";
import Head from "../layout/head/Head";

import AuthFooter from "../pages/auth/AuthFooter";

const HERE_API_KEY = process.env.REACT_APP_HERE_API_KEY;

const MapboxLoadingContainer = () => (
  <div className="nk-block-middle" style={{ textAlign: 'center', padding: '2rem' }}>
    <Spinner size="sm" color="primary" />
    <p className="text-muted mt-2">Loading Map...</p>
    <small className="text-muted">
      If map doesn't load, please use manual coordinate entry
    </small>
  </div>
);

const Signin = () => {
  const [backendValErrors, setBackendValErrors] = useState({});
  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const captchaRef = useRef(null);
  const dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const defaultCenter = { lat: -1.2921, lng: 36.8219 }; // Default to Nairobi
  const [isMapMode, setIsMapMode] = useState(true);
  const [searchBox, setSearchBox] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [mapError, setMapError] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapLoadError, setMapLoadError] = useState(false);
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchBoxRef = useRef(null);

  const handleMapClick = (mapProps, map, clickEvent) => {
    const lat = clickEvent.latLng.lat();
    const lng = clickEvent.latLng.lng();
    setSelectedLocation({ lat, lng });
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  const onMapReady = (mapProps, map) => {
    const input = document.getElementById('pac-input');
    const searchBox = new window.google.maps.places.SearchBox(input);

    setSearchBox(searchBox);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      const place = places[0];
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setSelectedLocation({ lat, lng });
      setValue("latitude", lat);
      setValue("longitude", lng);

      // Clear the search input
      setSearchInput('');
    });
  };

  const handleMapError = (error) => {
    setMapError('Failed to load Google Maps. Please try again or use manual coordinates.');
    setIsMapLoading(false);
    console.error('Google Maps Error:', error);
  };

  const handleMapReady = () => {
    setIsMapLoading(false);
    setMapError(null);
  };

  const schema = yup.object().shape({
    full_names: yup.string().required("Directors name is required"),
    login_email: yup.string().required("Login Email is required"),
    phone_number: yup.string().required("Contact Phone number is required"),
    directors_isk_numer: yup.string().required("Directors ISK number is required"),
    directors_vrb_numer: yup.string().required("Directors VRB number is required"),
    company_name: yup.string().required("Company Name is required"),
    location_name: yup.string().required("Location name is required"),
    latitude: yup.number()
      .required('Latitude is required')
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90'),
    longitude: yup.number()
      .required('Longitude is required')
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180'),
  });
  const {
    register: registerValuerRequestForm,
    isLoading: isSubmittingForm,
    reset: resetRequestForm,
    handleSubmit: handleSubmitRequestValuerAccess,
    formState: { errors: requestvalueraccesserrors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [requestValuerAccess, { isLOading: isSubmitting }] = useRequestUploaderAccessMutation();
  const sendRequestForm = async (data) => {
    const token = captchaRef.current.getValue();

    const jsonData = {
      valuationFirmEmail: data.login_email,
      valuationFirmPhone: data.phone_number,
      iskNumber: data.directors_isk_numer,
      vrbNumber: data.directors_vrb_numer,
      valuationFirmName: data.company_name,
      directorName: data.full_names,
      valuationFirmLatitude: selectedLocation?.lat?.toString(),
      valuationFirmLongitude: selectedLocation?.lng?.toString(),
      valuationFirmLocation: data.location_name,
      recaptcha_token: token
    };
    const result = await requestValuerAccess(jsonData);
    if ("error" in result) {
      if ("backendvalerrors" in result.error.data) {
        setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
      resetRequestForm();
    }
  };


  useEffect(() => {
    console.log('Using HERE API Key:', HERE_API_KEY);

    if (!HERE_API_KEY) {
      console.error('HERE API Key is not available');
      setMapLoadError(true);
    }
  }, []);

  useEffect(() => {
    if (!isMapMode || mapLoadError || !mapContainer.current || isMapInitialized) return;

    try {
      // Initialize HERE Map
      const platform = new H.service.Platform({
        apikey: HERE_API_KEY
      });

      const defaultLayers = platform.createDefaultLayers();

      // Initialize map with selected location or default center
      const center = selectedLocation || defaultCenter;

      // Create map instance
      const map = new H.Map(
        mapContainer.current,
        defaultLayers.vector.normal.map,
        {
          center: center,
          zoom: selectedLocation ? 14 : 6,
          pixelRatio: window.devicePixelRatio || 1
        }
      );

      // Store references
      mapRef.current = map;

      // Add interactive behavior immediately
      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      const ui = H.ui.UI.createDefault(map, defaultLayers);

      // Create and add marker
      const marker = new H.map.Marker(center);
      map.addObject(marker);
      markerRef.current = marker;

      // Handle window resize
      const handleResize = () => {
        if (map) {
          map.getViewPort().resize();
        }
      };
      window.addEventListener('resize', handleResize);

      setMapInstance(map);
      setIsMapInitialized(true);
      setIsMapLoading(false);

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        if (marker) {
          map.removeObject(marker);
        }
        if (map) {
          map.dispose();
        }
        mapRef.current = null;
        markerRef.current = null;
        setMapInstance(null);
        setIsMapInitialized(false);
      };

    } catch (error) {
      console.error('HERE Maps initialization error:', error);
      setMapLoadError(true);
      setIsMapMode(false);
      setIsMapInitialized(false);
    }
  }, [isMapMode, mapLoadError]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !selectedLocation || !isMapInitialized) return;

    try {
      const position = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      };

      mapRef.current.setCenter(position);
      mapRef.current.setZoom(14);
      markerRef.current.setGeometry(position);
    } catch (error) {
      console.error('Error updating map position:', error);
    }
  }, [selectedLocation, isMapInitialized]);

  useEffect(() => {
    if (!HERE_API_KEY) {
      console.error('HERE API Key is not defined');
    }
  }, [HERE_API_KEY]);

  // Add function to get location name from coordinates
  const getLocationNameFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&apiKey=${HERE_API_KEY}&lang=en-US`
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const address = data.items[0].address;
        // Construct a meaningful location name
        const locationName = [
          address.buildingName,
          address.street,
          address.district,
          address.city
        ].filter(Boolean).join(', ');

        setValue('location_name', locationName);
      }
    } catch (error) {
      console.error('Error getting location name:', error);
    }
  };

  // Update handleCoordinateChange to include reverse geocoding
  const handleCoordinateChange = (type, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newLocation = type === 'lat'
        ? { lat: numValue, lng: selectedLocation?.lng || defaultCenter.lng }
        : { lat: selectedLocation?.lat || defaultCenter.lat, lng: numValue };

      setSelectedLocation(newLocation);
      setValue(type === 'lat' ? "latitude" : "longitude", numValue);

      // Only fetch location name if we have both coordinates
      if (newLocation.lat && newLocation.lng) {
        getLocationNameFromCoordinates(newLocation.lat, newLocation.lng);
      }
    }
  };

  // Also update map click handler to include reverse geocoding
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !isMapInitialized) return;

    const handleMapClick = (evt) => {
      const coord = mapRef.current.screenToGeo(
        evt.currentPointer.viewportX,
        evt.currentPointer.viewportY
      );

      const position = {
        lat: coord.lat,
        lng: coord.lng
      };

      markerRef.current.setGeometry(position);
      setSelectedLocation(position);
      setValue("latitude", position.lat);
      setValue("longitude", position.lng);

      // Get location name for clicked position
      getLocationNameFromCoordinates(position.lat, position.lng);
    };

    mapRef.current.addEventListener('tap', handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.removeEventListener('tap', handleMapClick);
      }
    };
  }, [isMapInitialized]);

  // Update the search function
  const handleSearch = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for:', query);
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?apiKey=${HERE_API_KEY}&q=${encodeURIComponent(query)}&in=countryCode:KEN&limit=5`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      console.log('Search results:', data);
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (result) => {
    console.log('Selected result:', result);

    // Extract position from the result
    const position = {
      lat: result.position?.lat,
      lng: result.position?.lng
    };

    console.log('Position:', position);

    if (mapRef.current && markerRef.current && position.lat && position.lng) {
      // Update map
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(14);
      markerRef.current.setGeometry(position);

      // Update form values
      setSelectedLocation(position);
      setValue("latitude", position.lat);
      setValue("longitude", position.lng);

      // Get and set location name
      if (result.address?.label) {
        setValue("location_name", result.address.label);
      } else {
        getLocationNameFromCoordinates(position.lat, position.lng);
      }

      // Clear search
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Add debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Update the map view JSX
  const renderMapView = () => (
    <Row>
      <Col>
        <div className="map-container position-relative">
          <div className="map-search-box">
            <input
              ref={searchBoxRef}
              type="text"
              className="form-control"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div
                className="search-results-dropdown"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '0 0 4px 4px',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {isSearching ? (
                  <div className="search-result-item">
                    <Spinner size="sm" /> Searching...
                  </div>
                ) : (
                  searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="search-result-item"
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        backgroundColor: 'white',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      {result.address?.label || result.title || 'Unknown location'}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div
            ref={mapContainer}
            style={{ height: '300px' }}
            className="form-control-wrap"
          >
            {isMapLoading && <MapboxLoadingContainer />}
          </div>
        </div>
      </Col>
    </Row>
  );

  // Add styles
  const mapStyles = `
    .map-container {
      position: relative;
    }

    .map-search-box {
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      max-width: 400px;
      z-index: 1;
    }

    .search-results-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 4px 4px;
      max-height: 200px;
      overflow-y: auto;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .search-result-item {
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .search-result-item:hover {
      background-color: #f8f9fa;
    }
  `;

  // Add styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mapStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      <Head title="Register" />
      <Block className="nk-block-middle nk-auth-body  wide-lg">
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Valuer Access Request</BlockTitle>
            </BlockContent>
          </BlockHead>

          <form onSubmit={handleSubmitRequestValuerAccess(sendRequestForm)}>

            <Row>
              <Col>
                {" "}
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Director's Full Names
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="default-01"
                      {...registerValuerRequestForm("full_names", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your Full Names"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.full_names?.message && (
                      <span className="invalid">{requestvalueraccesserrors.full_names?.message}</span>
                    )}
                  </div>
                </div>
              </Col>

              <Col>
                {" "}

                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Account Login Email
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="default-01"
                      {...registerValuerRequestForm("login_email", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your email address"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.login_email?.message && (
                      <span className="invalid">{requestvalueraccesserrors.login_email?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>




            <Row>
              <Col>
                {" "}
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Company Name
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="default-01"
                      {...registerValuerRequestForm("company_name", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your Company Name"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.company_name?.message && (
                      <span className="invalid">{requestvalueraccesserrors.company_name?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col>
                {" "}

                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Contact Phone Number
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="default-01"
                      {...registerValuerRequestForm("phone_number", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your email address"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.phone_number?.message && (
                      <span className="invalid">{requestvalueraccesserrors.phone_number?.message}</span>
                    )}
                  </div>
                </div>

              </Col>
            </Row>

            <Row>
              <Col>
                {" "}
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Directors VRB Number
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="default-01"
                      {...registerValuerRequestForm("directors_vrb_numer", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter Directors VRB number"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.directors_vrb_numer?.message && (
                      <span className="invalid">{requestvalueraccesserrors.directors_vrb_numer?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col>
                {" "}
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Directors ISK Number
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="default-01"
                      {...registerValuerRequestForm("directors_isk_numer", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your email address"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.directors_isk_numer?.message && (
                      <span className="invalid">{requestvalueraccesserrors.directors_isk_numer?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col>

                <div className="form-group" style={{marginTop:"20px"}} >


                  {!isMapMode ? (
                    <></>
                  ) : (
                    renderMapView()
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-label-group">
                  <label className="form-label">Office Location</label>
                  <div className="form-control-wrap mb-3">
                    {/* <Button
                    size="sm"
                    onClick={() => setIsMapMode(!isMapMode)}
                    color="outline-primary"
                  >
                    {isMapMode ? "Enter Coordinates Manually" : "Use Map"}
                  </Button> */}
                  </div>
                </div>

                <div className="form-control-wrap mb-3">
                  <input
                    type="text"
                    id="location_name"
                    {...registerValuerRequestForm("location_name", { required: "Location name is required" })}
                    placeholder="Enter Location Name (e.g., Office Building Name, Street Address)"
                    className="form-control-lg form-control"
                  />
                  {requestvalueraccesserrors.location_name?.message && (
                    <span className="invalid">{requestvalueraccesserrors.location_name?.message}</span>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-control-wrap">
                  <input
                    type="number"
                    step="any"
                    id="latitude"
                    {...registerValuerRequestForm("latitude", { required: "Latitude is required" })}
                    placeholder="Enter Latitude in decimal"
                    className="form-control-lg form-control"
                    onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                  />
                  {requestvalueraccesserrors.latitude?.message && (
                    <span className="invalid">{requestvalueraccesserrors.latitude?.message}</span>
                  )}
                </div>
              </Col>
              <Col>
                <div className="form-control-wrap">
                  <input
                    type="number"
                    step="any"
                    id="longitude"
                    {...registerValuerRequestForm("longitude", { required: "Longitude is required" })}
                    placeholder="Enter Longitude in decimal"
                    className="form-control-lg form-control"
                    onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                  />
                  {requestvalueraccesserrors.longitude?.message && (
                    <span className="invalid">{requestvalueraccesserrors.longitude?.message}</span>
                  )}
                </div>
              </Col>
              {/* <Col xs="12" className="mt-2">
                    <Button
                      size="sm"
                      color="primary"
                      disabled={!selectedLocation?.lat || !selectedLocation?.lng}
                      onClick={() => {
                        setIsMapMode(true);
                      }}
                    >
                      View on Map
                    </Button>
                  </Col> */}
            </Row>
            <Row>
              <Col>
                <div className="form-group" style={{marginTop:"15px"}}>
                  <ReCAPTCHA className="recaptcha" sitekey={SITE_KEY} ref={captchaRef} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group" style={{marginTop:"15px"}} >
                  <Button size="lg" className="btn-block" type="submit" color="primary">
                    Submit
                  </Button>
                </div>
              </Col>
            </Row>


          </form>
          <div className="form-note-s2 text-center pt-1">
            <Link to="/request-accesor-access"> Request Accesosor Access</Link>
          </div>
          <div className="form-note-s2 text-center pt-1">Have an Account?</div>

          <div className="form-note-s2 text-center pt-1">
            <Link to="/login"> Login</Link>
          </div>
        </PreviewCard>
      </Block>
      <AuthFooter />
    </>
  );
};

export default Signin;
