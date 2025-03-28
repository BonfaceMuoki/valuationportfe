import React, { useRef, useState, useEffect, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {Controller, useForm } from "react-hook-form";
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
  RSelect,
} from "../components/Component";
import { useGetAccesorInviteDetailsQuery } from "../api/auth/inviteAccesorApiSlice";
import { useRegisterAccesorMutation } from "../api/auth/inviteAccesorApiSlice";
import Head from "../layout/head/Head";

import AuthFooter from "../pages/auth/AuthFooter";

import { Row, Col } from "reactstrap";
import { toast } from "react-toastify";

// 👇 Styled React Route Dom Link Component
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const ForwardedRSelect = forwardRef((props, ref) => {
  return <RSelect {...props} inputRef={ref} />;
});

function AcceptAccesorInviteSignup() {

  const lenderOptions = [
    { value: "Bank", label: "Bank" },
    { value: "Court", label: "Court" },
    { value: "Microfinance", label: "Microfinance" },
  ];


  const toastMessage = (message, type) => {
    if (type == "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
      });
    } else if (type == "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
      });
    } else if (type == "warning") {
      toast.warning(message, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
      });
    }
  };
  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const captchaRef = useRef(null);
  const [passState, setPassState] = useState(false);
  const [backendValErrors, setBackendValErrors] = useState({});
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { data: retrieved, isError, error } = useGetAccesorInviteDetailsQuery(params.get("token"));

  const [registerAccesor, { isLoading: loadingValuer }] = useRegisterAccesorMutation();

  const schema = yup.object().shape({
    institution_name: yup.string().required("Company Name is required"),
    full_names: yup.string().required("Your name is required"),
    phone_number: yup.string().required("Phone number is required"),
    institution_type: yup.object().shape({
      value: yup.string().required("Please specify institution type"),
      label: yup.string().required(),
    }),
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
    control,
    register: acceptInviteRegister,
    handleSubmit: handleSubmitRegisterValuer,
    setValue: setInviteValue,
    isLoading: loadingInviteDetails,
    formState: { errors: acceptInviteerrors },
  } = useForm({
    resolver: yupResolver(schema),
  });
console.log(retrieved?.inviteDetails?.institutionName,"retrieved?.inviteDetails?.accessor_name");
  useEffect(() => {
    if (!loadingInviteDetails && retrieved) {
      setInviteValue("institution_name", retrieved?.inviteDetails?.institutionName);
      setInviteValue("full_names", retrieved?.inviteDetails?.consumerContactPersonName);
      setInviteValue("login_email", retrieved?.inviteDetails?.consumerEmail);
      setInviteValue("phone_number", retrieved?.inviteDetails?.consumerContactPersonPhone);
      const institutionType = {
        value: retrieved?.inviteDetails?.consumerType,
        label: retrieved?.inviteDetails?.consumerType
      };
      setInviteValue("institution_type", institutionType);
    }
  }, [retrieved, loadingInviteDetails, setInviteValue]);

  const submitRegister = async (data) => {
    const requestBody = {
      consumerName: data.institution_name,
      contactPersonName: data.full_names,
      consumerEmail: data.login_email,
      consumerPhone: data.phone_number,
      consumerType: data.institution_type.value,
      accessStatus: "ACTIVE",
      inviteToken: params.get("token"),
      password: data.password,
      confirmPassword: data.confirm_password
    };

    const result = await registerAccesor(requestBody);
    
    if ("error" in result) {
      toastMessage(result.error.data.message, "error");
      if ("backendvalerrors" in result.error.data) {
        setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
      toastMessage(result.data.message, "success");
    }
  };
  if (!retrieved) {
    return (
      <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
        <BlockHead>
          <BlockContent>
            <BlockTitle tag="h4"> No Records found.</BlockTitle>
          </BlockContent>
        </BlockHead>
      </PreviewCard>
    );
  }

  if (Object.keys(retrieved).length === 0) {
    return (
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        {/* <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }} align="center">
          {" "}
          Invalid / Expired Invite.
        </Typography> */}
      </Block>
    );
  } else {
    return (
      <>
        <Head title="Register" />
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <form onSubmit={handleSubmitRegisterValuer(submitRegister)}>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Contact Person Full Names
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    readOnly
                    id="default-01"
                    {...acceptInviteRegister("full_names", { required: "This field is required" })}
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
                    {...acceptInviteRegister("login_email", { required: "This field is required" })}
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
                    Court / Lender Name
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    readOnly
                    id="default-01"
                    {...acceptInviteRegister("institution_name", { required: "This field is required" })}
                    defaultValue=""
                    placeholder="Enter your Company Name"
                    className="form-control-lg form-control"
                  />
                  {acceptInviteerrors.institution_name?.message && (
                    <span className="invalid">{acceptInviteerrors.institution_name?.message}</span>
                  )}
                </div>
              </div>

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

            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Type Of Institution
                </label>
              </div>
              <div className="form-control-wrap">
                <Controller
                  name="institution_type"
                  control={control}
                  render={({ field }) => (
                    <ForwardedRSelect {...field} options={lenderOptions} />
                  )}
                />

                {acceptInviteerrors.institution_type?.message && (
                  <span style={{ color: "red", fontStyle: "italic", fontSize: "11px" }} >{requestvalueraccesserrors.institution_type?.message}</span>
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
                        className={`form-icon lg form-icon-right passcode-switch ${
                          passState ? "is-hidden" : "is-shown"
                        }`}
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
                        className={`form-icon lg form-icon-right passcode-switch ${
                          passState ? "is-hidden" : "is-shown"
                        }`}
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
              <Link to="/request-valuer-access"> Request Uploader Access</Link>
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
  }
}

export default AcceptAccesorInviteSignup;
