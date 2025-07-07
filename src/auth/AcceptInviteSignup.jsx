// AcceptInviteSignup.jsx
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Spinner, Row, Col } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useRegisterUploaderMutation, useGetValuerInviteDetailsQuery } from "../api/auth/inviteValuerApiSlice";
import { Block, BlockHead, BlockContent, BlockTitle, PreviewCard } from "../components/Component";
import Head from "../layout/head/Head";
import AuthFooter from "../pages/auth/AuthFooter";

const HERE_API_KEY = process.env.REACT_APP_HERE_API_KEY;
const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;

const AcceptInviteSignup = () => {
  const [passVisible, setPassVisible] = useState(false);
  const captchaRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainer = useRef(null);
  const searchInputRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const params = new URLSearchParams(location.search);
  const { data: inviteData, isLoading: loadingInviteDetails } = useGetValuerInviteDetailsQuery(params.get("token"));
  const [registerValuer, { isLoading: loadingValuer }] = useRegisterUploaderMutation();

  const schema = yup.object().shape({
    company_name: yup.string().required("Company Name is required"),
    full_name: yup.string().required("Full name is required"),
    vrb_number: yup.string().required("VRB Number is required"),
    isk_number: yup.string().required("ISK Number is required"),
    phone_number: yup.string().required("Phone number is required"),
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
    confirm_password: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm password"),
    location_name: yup.string().required("Location is required"),
    latitude: yup.number().required("Latitude is required"),
    longitude: yup.number().required("Longitude is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (inviteData?.details) {
      const d = inviteData.details;
      setValue("company_name", d.valuationFirmName);
      setValue("full_name", d.directorName);
      setValue("email", d.inviteEmail);
      setValue("vrb_number", d.vrbNumber);
      setValue("isk_number", d.iskNumber);
      setValue("phone_number", d.invitePhone);
    }
  }, [inviteData, setValue]);

  useEffect(() => {
    if (!mapInitialized && mapContainer.current && window.H && window.H.Map) {
      const platform = new window.H.service.Platform({ apikey: HERE_API_KEY });
      const defaultLayers = platform.createDefaultLayers();
      const map = new window.H.Map(
        mapContainer.current,
        defaultLayers.vector.normal.map,
        {
          center: { lat: -1.2921, lng: 36.8219 },
          zoom: 12,
        }
      );
      const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
      window.H.ui.UI.createDefault(map, defaultLayers);

      const marker = new window.H.map.Marker({ lat: -1.2921, lng: 36.8219 }, { volatility: true });
      marker.draggable = true;
      map.addObject(marker);
      mapRef.current = map;
      markerRef.current = marker;

      map.addEventListener("dragstart", function (ev) {
        if (ev.target instanceof window.H.map.Marker) behavior.disable();
      }, false);

      map.addEventListener("drag", function (ev) {
        if (ev.target instanceof window.H.map.Marker) {
          const pointer = ev.currentPointer;
          const geo = map.screenToGeo(pointer.viewportX, pointer.viewportY);
          ev.target.setGeometry(geo);
        }
      }, false);

      map.addEventListener("dragend", function (ev) {
        if (ev.target instanceof window.H.map.Marker) {
          behavior.enable();
          const pos = ev.target.getGeometry();
          setValue("latitude", pos.lat);
          setValue("longitude", pos.lng);
        }
      }, false);

      setMapInitialized(true);
    }
  }, [mapInitialized, setValue]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(searchQuery)}&in=countryCode:KEN&limit=5&apiKey=${HERE_API_KEY}`)
          .then(res => res.json())
          .then(data => setSearchResults(data.items || []))
          .catch(() => setSearchResults([]));
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSelect = (location) => {
    if (!mapRef.current || !markerRef.current || !location.position) return;

    const pos = {
      lat: location.position.lat,
      lng: location.position.lng,
    };

    mapRef.current.setCenter(pos);
    mapRef.current.setZoom(14);
    markerRef.current.setGeometry(pos);
    setValue("latitude", pos.lat);
    setValue("longitude", pos.lng);
    setValue("location_name", location.address.label || "");
    setSearchQuery("");
    setSearchResults([]);
  };

  const onSubmit = async (data) => {
    const payload = {
      companyEmail: data.email,
      organizationPhone: data.phone_number,
      directorIskNumber: data.isk_number,
      directorsVrb: data.vrb_number,
      valuationFirmName: data.company_name,
      directorName: data.full_name,
      valuationFirmLatitude: data.latitude.toString(),
      valuationFirmLongitude: data.longitude.toString(),
      valuationFirmTown: data.location_name,
      inviteToken: params.get("token"),
      adminSignInEmail: data.email,
      password: data.password,
      passwordConfirmation: data.confirm_password,
      type: ""
    };

    const result = await registerValuer(payload);
    if (result?.data?.status === "SUCCESS") {
      navigate("/login");
    }
  };

  return (
    <>
      <Head title="Valuation Firm Registration" />
      <Block className="nk-block-middle nk-auth-body wide-lg">
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Valuation Firm Registration</BlockTitle>
            </BlockContent>
          </BlockHead>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="gy-4">
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input {...register("full_name")} className="form-control form-control-lg" readOnly />
                  {errors.full_name && <span className="text-danger small">{errors.full_name.message}</span>}
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input {...register("email")} className="form-control form-control-lg" readOnly />
                  {errors.email && <span className="text-danger small">{errors.email.message}</span>}
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input {...register("company_name")} className="form-control form-control-lg" readOnly />
                  {errors.company_name && <span className="text-danger small">{errors.company_name.message}</span>}
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input {...register("phone_number")} className="form-control form-control-lg" readOnly />
                  {errors.phone_number && <span className="text-danger small">{errors.phone_number.message}</span>}
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">VRB Number</label>
                  <input {...register("vrb_number")} className="form-control form-control-lg" readOnly />
                  {errors.vrb_number && <span className="text-danger small">{errors.vrb_number.message}</span>}
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">ISK Number</label>
                  <input {...register("isk_number")} className="form-control form-control-lg" readOnly />
                  {errors.isk_number && <span className="text-danger small">{errors.isk_number.message}</span>}
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type={passVisible ? "text" : "password"} {...register("password")} className="form-control form-control-lg" />
                  {errors.password && <span className="text-danger small">{errors.password.message}</span>}
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type={passVisible ? "text" : "password"} {...register("confirm_password")} className="form-control form-control-lg" />
                  {errors.confirm_password && <span className="text-danger small">{errors.confirm_password.message}</span>}
                </div>
              </Col>

              <Col md="12">
                <label className="form-label">Search Location</label>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Search for a place..."
                />
                {searchResults.length > 0 && (
                  <div className="bg-white border mt-1 rounded shadow-sm position-absolute w-100 zindex-100">
                    {searchResults.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 border-bottom cursor-pointer"
                        onClick={() => handleSearchSelect(item)}
                      >
                        {item.address.label}
                      </div>
                    ))}
                  </div>
                )}
              </Col>

              <Col md="12">
                <label className="form-label">Office Location (click map)</label>
                <div
                  ref={mapContainer}
                  style={{ width: "100%", height: "300px", border: "1px solid #ccc", borderRadius: "8px" }}
                ></div>
              </Col>

              <Col md="12">
                <label className="form-label">Location Name</label>
                <input {...register("location_name")} className="form-control form-control-lg" />
                {errors.location_name && <span className="text-danger small">{errors.location_name.message}</span>}
              </Col>

              <Col md="6">
                <label className="form-label">Latitude</label>
                <input {...register("latitude", { valueAsNumber: true })} className="form-control form-control-lg" readOnly />
              </Col>

              <Col md="6">
                <label className="form-label">Longitude</label>
                <input {...register("longitude", { valueAsNumber: true })} className="form-control form-control-lg" readOnly />
              </Col>

              <Col md="12" className="pt-2">
                {SITE_KEY && <ReCAPTCHA sitekey={SITE_KEY} ref={captchaRef} />}
              </Col>

              <Col md="12">
                <Button type="submit" color="primary" className="w-100 mt-3" size="lg">
                  {loadingValuer ? <Spinner size="sm" /> : "Register"}
                </Button>
              </Col>
            </Row>
          </form>
        </PreviewCard>
      </Block>
      <AuthFooter />
    </>
  );
};

export default AcceptInviteSignup;
