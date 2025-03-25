import React, { useRef, useEffect } from "react";

import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import ReCAPTCHA from "react-google-recaptcha";
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

import { Row, Col, Spinner } from "reactstrap";
import { useGetValuerInviteDetailsQuery } from "../api/auth/inviteValuerApiSlice";
import { useRegisterUploaderMutation } from "../api/auth/inviteValuerApiSlice";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { toast } from "react-toastify";
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

const AcceptInviteSignup = () => {
  const [passState, setPassState] = useState(false);
  const toastMessage = (message, type) => {
  
    switch (type) {
      case "error":
        toast.error(message);
        break;
      case "success":
        toast.success(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  };
  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const SECRET_KEY = process.env.REACT_APP_reCAPTCHA_SECRET_KEY;
  const captchaRef = useRef(null);
  const dispatch = useDispatch();
  // const { data } = useGetUsersQuery();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { data: retrieved, isError, error } = useGetValuerInviteDetailsQuery(params.get("token"));
  const [backendValErrors, setBackendValErrors] = useState({});
  const [registerValuer, { isLoading: loadingValuer }] = useRegisterUploaderMutation();
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
        const locationName = [
          address.buildingName,
          address.street,
          address.district,
          address.city
        ].filter(Boolean).join(', ');

        setInviteValue('location_name', locationName);
      }
    } catch (error) {
      console.error('Error getting location name:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?apiKey=${HERE_API_KEY}&q=${encodeURIComponent(query)}&in=countryCode:KEN&limit=5`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchResultClick = (result) => {
    if (!mapRef.current || !markerRef.current || !result.position) return;

    const position = {
      lat: result.position.lat,
      lng: result.position.lng
    };

    markerRef.current.setGeometry(position);
    mapRef.current.setCenter(position);
    mapRef.current.setZoom(14);

    setSelectedLocation(position);
    setInviteValue('latitude', position.lat);
    setInviteValue('longitude', position.lng);
    setInviteValue('location_name', result.address?.label || '');
    
    setSearchQuery('');
    setSearchResults([]);
  };

  useEffect(() => {
    if (!isMapMode || mapLoadError || !mapContainer.current || isMapInitialized) return;

    try {
      const platform = new H.service.Platform({
        apikey: HERE_API_KEY
      });

      const defaultLayers = platform.createDefaultLayers();
      const center = selectedLocation || defaultCenter;

      // Create map instance
      const map = new H.Map(
        mapContainer.current,
        defaultLayers.vector.normal.map,
        {
          center: center,
          zoom: 12,
          pixelRatio: window.devicePixelRatio || 1
        }
      );

      // Create behavior instance
      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      
      // Create UI instance
      const ui = H.ui.UI.createDefault(map, defaultLayers);

      // Create initial marker
      const marker = new H.map.Marker(center);
      map.addObject(marker);

      // Store references
      mapRef.current = map;
      markerRef.current = marker;

      // Simple tap/click handler
      map.addEventListener('tap', (evt) => {
        const pointer = evt.currentPointer;
        const coordinates = map.screenToGeo(pointer.viewportX, pointer.viewportY);
        
        const position = {
          lat: coordinates.lat,
          lng: coordinates.lng
        };

        marker.setGeometry(position);
        setSelectedLocation(position);
        setInviteValue('latitude', position.lat);
        setInviteValue('longitude', position.lng);
      });

      setIsMapInitialized(true);
      setIsMapLoading(false);

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapLoadError(true);
      setIsMapLoading(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.dispose();
        mapRef.current = null;
        markerRef.current = null;
        setIsMapInitialized(false);
      }
    };
  }, [isMapMode, mapLoadError]);

  const renderMapView = () => (
    <div className="form-group">
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 1 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleSearchResultClick(result)}
                >
                  {result.address?.label || 'Unknown location'}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          ref={mapContainer}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );

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

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mapStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !isMapInitialized) return;

    const handleMapClick = (evt) => {
      evt.stopPropagation(); // Prevent event bubbling
      
      try {
        const coord = mapRef.current.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );

        const position = {
          lat: coord.lat,
          lng: coord.lng
        };

        // Update marker position without recreating it
        markerRef.current.setGeometry(position);
        
        // Update form values
        setSelectedLocation(position);
        setInviteValue('latitude', position.lat);
        setInviteValue('longitude', position.lng);

        // Get location name
        getLocationNameFromCoordinates(position.lat, position.lng);
      } catch (error) {
        console.error('Error handling map click:', error);
      }
    };

    mapRef.current.addEventListener('tap', handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.removeEventListener('tap', handleMapClick);
      }
    };
  }, [isMapInitialized]);

  const schema = yup.object().shape({
    company_name: yup.string().required("Company Name is required"),
    full_name: yup.string().required("Your name is required"),
    vrb_number: yup.string().required("VRB Number is required"),
    isk_number: yup.string().required("ISK Number is required"),
    phone_number: yup.string().required("Phone number is required"),
    password: yup
      .string()
      .required("Please provide password")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{6,}$/,
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character"
      ),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords do not match.")
      .required("Please confirm the password"),
    // latitude: yup.number().required('Please select a location on the map'),
    // longitude: yup.number().required('Please select a location on the map'),
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
    register: acceptInviteRegister,
    handleSubmit: handleSubmitRegisterValuer,
    setValue: setInviteValue,
    isLoading: loadingInviteDetails,
    formState: { errors: acceptInviteerrors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    if (!loadingInviteDetails && retrieved) {
      console.log(retrieved?.details);
      setInviteValue("company_name", retrieved?.details?.valuationFirmName);
      setInviteValue("full_name", retrieved?.details?.directorName);
      setInviteValue("email", retrieved?.details?.inviteEmail);
      setInviteValue("vrb_number", retrieved?.details?.vrbNumber);
      setInviteValue("isk_number", retrieved?.details?.iskNumber);
      setInviteValue("phone_number", retrieved?.details?.invitePhone);
    }
  }, [retrieved, loadingInviteDetails, setInviteValue]);
  const navigate = useNavigate();
  const submitRegister = async (data) => {
    const requestData = {
      companyEmail: data.email,
      organizationPhone: data.phone_number,
      directorIskNumber: data.isk_number,
      directorsVrb: data.vrb_number,
      valuationFirmName: data.company_name,
      directorName: data.full_name,
      valuationFirmLatitude: data.latitude.toString(), // Convert to string to match API expectations
      valuationFirmLongitude: data.longitude.toString(), // Convert to string to match API expectations
      valuationFirmTown: data.location_name,
      inviteToken: params.get("token"),
      adminSignInEmail: data.email,
      password: data.password,
      passwordConfirmation: data.confirm_password,
      type: " "
    };

    const result = await registerValuer(requestData);
    if ("error" in result) {
      toastMessage(result.error.data.message, "error");
      if ("backendvalerrors" in result.error.data) {
        setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
      console.log(result);
      if (result.data.status === "SUCCESS") {
        toastMessage(result.data.message, "success");
        navigate("/login");
      } else {
        toastMessage(result.data.message, "error");
      }
      // navigate("/login");
    }
  };

  return (
    <>
      <Head title="Register" />
      <Block className="nk-block-middle nk-auth-body  wide-lg">
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Valuation Firm Registration </BlockTitle>
            </BlockContent>
          </BlockHead>

          <form onSubmit={handleSubmitRegisterValuer(submitRegister)}>
            <Row>
              <Col>
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Director of Valuation Full Names
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      readOnly
                      id="default-01"
                      {...acceptInviteRegister("full_name", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your Full Names"
                      className="form-control-lg form-control"
                    />
                    {acceptInviteerrors.full_names?.message && (
                      <span className="invalid">{acceptInviteerrors.full_names?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col>


                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Account Login Email
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      readOnly
                      id="default-01"
                      {...acceptInviteRegister("email", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your email address"
                      className="form-control-lg form-control"
                    />
                    {acceptInviteerrors.login_email?.message && (
                      <span className="invalid">{acceptInviteerrors.login_email?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>

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
                      readOnly
                      {...acceptInviteRegister("company_name", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your Company Name"
                      className="form-control-lg form-control"
                    />
                    {acceptInviteerrors.company_name?.message && (
                      <span className="invalid">{acceptInviteerrors.company_name?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col>

                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Contact Phone Number
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      readOnly
                      id="default-01"
                      {...acceptInviteRegister("phone_number", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your email address"
                      className="form-control-lg form-control"
                    />
                    {acceptInviteerrors.phone_number?.message && (
                      <span className="invalid">{acceptInviteerrors.phone_number?.message}</span>
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
                      readOnly
                      id="default-01"
                      {...acceptInviteRegister("vrb_number", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter Directors VRB number"
                      className="form-control-lg form-control"
                    />
                    {acceptInviteerrors.directors_vrb_numer?.message && (
                      <span className="invalid">{acceptInviteerrors.directors_vrb_numer?.message}</span>
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
                      readOnly
                      id="default-01"
                      {...acceptInviteRegister("isk_number", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your email address"
                      className="form-control-lg form-control"
                    />
                    {acceptInviteerrors.directors_isk_numer?.message && (
                      <span className="invalid">{acceptInviteerrors.isk_numer?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="password">
                      Passcode
                    </label>
                    <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                      Forgot Code?
                    </Link>
                  </div>
                  <div className="form-control-wrap">
                    <a
                      href="#password"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setPassState(!passState);
                      }}
                      className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                    >
                      <Icon name="eye" className="passcode-icon icon-show"></Icon>
                      <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                    </a>
                    <input
                      type={passState ? "text" : "password"}
                      id="password"
                      {...acceptInviteRegister("password", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your passcode"
                      className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                    />
                    {acceptInviteerrors.password?.message && (
                      <span className="invalid">{acceptInviteerrors.password?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col>
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="password">
                      Confirm Passwword
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <a
                      href="#password"
                      className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                    ></a>
                    <input
                      type={passState ? "text" : "password"}
                      id="password"
                      {...acceptInviteRegister("confirm_password", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Confirm Password"
                      className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                    />
                    {acceptInviteerrors.confirm_password?.message && (
                      <span className="invalid">{acceptInviteerrors.confirm_password?.message}</span>
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
                    {...acceptInviteRegister("location_name", { required: "Location name is required" })}
                    placeholder="Enter Location Name (e.g., Office Building Name, Street Address)"
                    className="form-control-lg form-control"
                  />
                  {acceptInviteerrors.location_name?.message && (
                    <span className="invalid">{acceptInviteerrors.location_name?.message}</span>
                  )}
                  {backendValErrors.valuationFirmLocation && (
                    <span className="invalid">{backendValErrors.valuationFirmLocation}</span>
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
                    {...acceptInviteRegister("latitude", { required: "Latitude is required" })}
                    placeholder="Enter Latitude in decimal"
                    className="form-control-lg form-control"
                    onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                  />
                  {acceptInviteerrors.latitude?.message && (
                    <span className="invalid">{acceptInviteerrors.latitude?.message}</span>
                  )}
                  {backendValErrors.valuationFirmLatitude && (
                    <span className="invalid">{backendValErrors.valuationFirmLatitude}</span>
                  )}
                </div>
              </Col>
              <Col>
                <div className="form-control-wrap">
                  <input
                    type="number"
                    step="any"
                    id="longitude"
                    {...acceptInviteRegister("longitude", { required: "Longitude is required" })}
                    placeholder="Enter Longitude in decimal"
                    className="form-control-lg form-control"
                    onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                  />
                  {acceptInviteerrors.longitude?.message && (
                    <span className="invalid">{acceptInviteerrors.longitude?.message}</span>
                  )}
                  {backendValErrors.valuationFirmLongitude && (
                    <span className="invalid">{backendValErrors.valuationFirmLongitude}</span>
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
            <div className="form-group">
              {" "}
              <ReCAPTCHA className="recaptcha" sitekey={SITE_KEY} ref={captchaRef} />
            </div>
            <div className="form-group">
              <Button size="lg" className="btn-block" type="submit" color="primary">
                Submit
              </Button>
            </div>
          </form>
          <div className="form-note-s2 text-center pt-1">
            <Link to="/request-accesor-access"> Request Accesosor Access</Link>
          </div>
          <div className="form-note-s2 text-center pt-3">Have an Account?</div>

          <div className="form-note-s2 text-center pt-4">
            <Link to="/login"> Login</Link>
          </div>
          <div className="text-center pt-1 pb-1">
            <h6 className="overline-title overline-title-sap">
              <span>OR</span>
            </h6>
          </div>
        </PreviewCard>
      </Block>
      <AuthFooter />
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(AcceptInviteSignup);
