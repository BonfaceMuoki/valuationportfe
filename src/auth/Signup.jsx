import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { useRequestUploaderAccessMutation } from "../api/auth/inviteValuerApiSlice";
import { Row, Col, Spinner } from "reactstrap";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
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

const LoadingContainer = () => (
  <div className="nk-block-middle" style={{ textAlign: 'center', padding: '2rem' }}>
    <Spinner size="sm" color="primary" />
    <p className="text-muted mt-2">Loading Maps...</p>
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

  const mapStyles = {
    width: '100%',
    height: '300px',
  };

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
    const formData = new FormData();
    formData.append("full_names", data.full_names);
    formData.append("company_name", data.company_name);
    formData.append("recaptcha_token", token);
    formData.append("login_email", data.login_email);
    formData.append("phone_number", data.phone_number);
    formData.append("directors_isk_numer", data.directors_isk_numer);
    formData.append("directors_vrb_numer", data.directors_vrb_numer);
    formData.append('latitude', selectedLocation?.lat);
    formData.append('longitude', selectedLocation?.lng);
    const result = await requestValuerAccess(formData);
    if ("error" in result) {
      if ("backendvalerrors" in result.error.data) {
        setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
      resetRequestForm();
    }
  };

  useEffect(() => {
    const mapTimeout = setTimeout(() => {
      if (!window.google) {
        setMapLoadError(true);
        setIsMapMode(false); // Switch to manual mode
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(mapTimeout);
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

            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label">Office Location</label>
                <div className="form-control-wrap mb-3">
                  <Button
                    size="sm"
                    onClick={() => setIsMapMode(!isMapMode)}
                    color="outline-primary"
                  >
                    {isMapMode ? "Enter Coordinates Manually" : "Use Map"}
                  </Button>
                </div>
              </div>

              {!isMapMode ? (
                <Row>
                  <Col>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        step="any"
                        id="latitude"
                        {...registerValuerRequestForm("latitude", { required: "Latitude is required" })}
                        placeholder="Enter Latitude"
                        className="form-control-lg form-control"
                        onChange={(e) => {
                          const lat = parseFloat(e.target.value);
                          setSelectedLocation(prev => ({
                            lat,
                            lng: prev?.lng || defaultCenter.lng
                          }));
                        }}
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
                        placeholder="Enter Longitude"
                        className="form-control-lg form-control"
                        onChange={(e) => {
                          const lng = parseFloat(e.target.value);
                          setSelectedLocation(prev => ({
                            lat: prev?.lat || defaultCenter.lat,
                            lng
                          }));
                        }}
                      />
                      {requestvalueraccesserrors.longitude?.message && (
                        <span className="invalid">{requestvalueraccesserrors.longitude?.message}</span>
                      )}
                    </div>
                  </Col>
                </Row>
              ) : (
                <div className="form-group">
                  {mapLoadError ? (
                    <div className="alert alert-warning">
                      <Icon name="alert-circle" />
                      <span>
                        Map loading failed. Please use manual coordinate entry or try again later.
                      </span>
                      <Button
                        size="sm"
                        className="ml-2"
                        color="outline-primary"
                        onClick={() => window.location.reload()}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <div className="form-control-wrap" style={{ height: '300px', position: 'relative' }}>
                      <Map
                        google={window.google}
                        zoom={12}
                        style={mapStyles}
                        initialCenter={defaultCenter}
                        onClick={handleMapClick}
                        center={selectedLocation || defaultCenter}
                        onError={() => {
                          setMapLoadError(true);
                          setIsMapMode(false);
                        }}
                      >
                        {selectedLocation && (
                          <Marker position={selectedLocation} />
                        )}
                      </Map>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
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

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  LoadingContainer: LoadingContainer,
  timeout: 10000, // 10 seconds timeout
})(Signin);
