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

import { Row, Col } from "reactstrap";
import { useGetValuerUserInviteDetailsQuery, useRegisterUploaderUserMutation } from "../api/auth/inviteValuerApiSlice";
import { useRegisterUploaderMutation } from "../api/auth/inviteValuerApiSlice";

const AcceptValuerUserInviteSignup = () => {
  const [passState, setPassState] = useState(false);
  const toastMessage = (message, type) => {};
  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const SECRET_KEY = process.env.REACT_APP_reCAPTCHA_SECRET_KEY;
  const captchaRef = useRef(null);
  const dispatch = useDispatch();
  // const { data } = useGetUsersQuery();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { data: retrieved, isError, error } = useGetValuerUserInviteDetailsQuery(params.get("token"));
  console.log(retrieved, "retrievedretrievedretrieved");
  const [backendValErrors, setBackendValErrors] = useState({});
  const [registerValuer, { isLoading: loadingValuer }] = useRegisterUploaderUserMutation();

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
      console.log(retrieved);
      setInviteValue("company_name", retrieved?.organization_name);
      setInviteValue("full_name", retrieved?.full_name);
      setInviteValue("email", retrieved?.invite_email);
      setInviteValue("vrb_number", retrieved?.vrb_number);
      setInviteValue("isk_number", retrieved?.isk_number);
      setInviteValue("phone_number", retrieved?.personal_phone);
    }
  }, [retrieved, loadingInviteDetails, setInviteValue]);
  const navigate = useNavigate();
  const submitRegister = async (data) => {
    const formdata = new FormData();
    formdata.append("company_name", data.company_name);

    formdata.append("organization", retrieved.organization_id);

    formdata.append("email", data.email);
    formdata.append("organization_phone", data.phone_number);
    formdata.append("vrb_number", data.vrb_number);
    formdata.append("directors_vrb", data.vrb_number);
    formdata.append("isk_number", data.isk_number);
    formdata.append("password", data.password);
    formdata.append("password_confirmation", data.confirm_password);
    formdata.append("company_email", data.email);
    formdata.append("register_as", "Report Uploader Admin");
    formdata.append("full_name", data.full_name);
    const result = await registerValuer(formdata);
    if ("error" in result) {
      toastMessage(result.error.data.message, "error");
      if ("backendvalerrors" in result.error.data) {
        setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
      toastMessage(result.data.message, "success");
      navigate("/login");
    }
  };

  return (
    <>
      <Head title="Register" />
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Valuer Access Request</BlockTitle>
            </BlockContent>
          </BlockHead>

          <form onSubmit={handleSubmitRegisterValuer(submitRegister)}>
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

            <Row>
              <Col>
                {" "}
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      VRB Number
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
                      ISK Number
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

export default AcceptValuerUserInviteSignup;
