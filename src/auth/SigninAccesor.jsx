import React, { useRef, useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import { Controller,useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import {RSelect} from "../components/Component";

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

import { useRequestLenderCourtAccessMutation } from "../api/auth/inviteAccesorApiSlice";

// Wrap RSelect in forwardRef
const ForwardedRSelect = forwardRef((props, ref) => {
  return <RSelect {...props} inputRef={ref} />;
});

const SigninAccesor = () => {


  const lenderOptions = [
    { value: "Bank", label: "Bank" },
    { value: "Court", label: "Court" },
    { value: "Microfinance", label: "Microfinance" },
  ];
  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const captchaRef = useRef(null);
  //register form

  const schema = yup.object().shape({
    full_names: yup.string().required("Directors name is required"),
    login_email: yup.string().required("Login Email is required"),
    phone_number: yup.string().required("Contact Phone number is required"),
    institution_name: yup.string().required("Company Name is required"),
    institution_type: yup.object().shape({
      value: yup.string().required("Please specify institution type"),
      label: yup.string().required(),
    })
  });
  const {
    control,
    register: registerAccesorRequestForm,
    isLoading: isSubmittingForm,
    reset: resetRequestForm,
    handleSubmit: handleSubmitRequestValuerAccess,
    formState: { errors: requestvalueraccesserrors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [submitAccessRequest, { isLoading }] = useRequestLenderCourtAccessMutation();

  const sendRequestForm = async (data) => {
    console.log(data);
    const token = await captchaRef.current.getValue();
    
    const requestData = {
      institutionName: data.institution_name,
      consumerContactPersonName: data.full_names,
      consumerEmail: data.login_email,
      consumerContactPersonPhone: data.phone_number,
      consumerType: data.institution_type.value.toUpperCase(),
      consumerLocationName: "San Francisco, CA", 
      consumerLatitude: "37.7749", 
      consumerLongitude: "-122.4194",
      recaptcha_token: token
    };

    const result = await submitAccessRequest(requestData);
    if ("error" in result) {
    } else {
      resetRequestForm();
    }
  };
  //close register page

  return (
    <>
      <Head title="Register" />
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4"> Lender/Court Access Request</BlockTitle>
            </BlockContent>
          </BlockHead>

          <form onSubmit={handleSubmitRequestValuerAccess(sendRequestForm)}>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Contact Person Full Names
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...registerAccesorRequestForm("full_names", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your Full Names"
                  className="form-control-lg form-control"
                />
                {requestvalueraccesserrors.full_names?.message && (
                  <span className="invalid">{requestvalueraccesserrors.full_names?.message}</span>
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
                  id="default-01"
                  {...registerAccesorRequestForm("login_email", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your email address"
                  className="form-control-lg form-control"
                />
                {requestvalueraccesserrors.login_email?.message && (
                  <span className="invalid">{requestvalueraccesserrors.login_email?.message}</span>
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
                  id="default-01"
                  {...registerAccesorRequestForm("institution_name", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your Company Name"
                  className="form-control-lg form-control"
                />
                {requestvalueraccesserrors.institution_name?.message && (
                  <span className="invalid" style={{color:"red"}} >{requestvalueraccesserrors.institution_name?.message}</span>
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

                {requestvalueraccesserrors.institution_type?.message && (
                  <span style={{color:"red", fontStyle:"italic", fontSize:"11px"}} >{requestvalueraccesserrors.institution_type?.message}</span>
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
                  id="default-01"
                  {...registerAccesorRequestForm("phone_number", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your email address"
                  className="form-control-lg form-control"
                />
                {requestvalueraccesserrors.phone_number?.message && (
                  <span className="invalid">{requestvalueraccesserrors.phone_number?.message}</span>
                )}
              </div>
            </div>

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
};

export default SigninAccesor;
