import React, { useState, useEffect } from "react";
import { BlockTitle } from "../../components/Component";
import makeAnimated from "react-select/animated";
import { useForm, Controller } from "react-hook-form";
import { Steps, Step } from "react-step-builder";
import { Row, Col, Button, Card } from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import MapWithAutoSearch from "./MapWithAutoSearch";
import {
  upDateRecipientRecipientsProperty,
  clearValuationReportData,
  selectCurrentSignatories,
  selectCurrentToken,
  setReportSignatories,
  setValuationLocationDetails,
  upDateRecipientRecipients,
  selectRecipientRecipients,
  setRecipientRecipients,
} from "../../featuers/authSlice";
import { Alert } from "reactstrap";
import {
  selectLocationDetails,
  selectPropertyDetails,
  setValuationPropertyDetails,
  selectValuationDetails,
  selectCurrentRecipient,
  setRecipientUsernames,
  setRecipientEmails,
  setRecipientPhone,
  setValuationDetails,
  setReportRecipient,
} from "../../featuers/authSlice";
import {
  useUploadValuationReportV2Mutation,
  useGetUsersQuery,
  useGetAccesorsListQuery,
  useGetPropertyTypeListQuery,
} from "../../api/commonEndPointsAPI";
import { Collapse } from "reactstrap";
import Select from "react-select";
import {
  useCacheReportDocumentMutation,
  useDownLoadCachedFileMutation,
  useGetCurrentUploadedFileQuery,
  useSubmitValuationReportMutation,
} from "../../api/uploader/uploaderApiEndpoints";
import Swal from "sweetalert2";
import axios from "axios";
import { selectGPSDetails } from "../../featuers/authSlice";
import { Spinner } from "reactstrap";

const LocationForm = (props) => {
  const dispatch = useDispatch();
  const gpsdetails = useSelector(selectGPSDetails);
  const locationDetails = useSelector(selectLocationDetails);

  const locationValidationSchema = Yup.object().shape({
    locationName: Yup.string().required("Location Name is required"),
    town: Yup.string().required("Town is required"),
    street: Yup.string().required("Street is required"),
    county: Yup.string().required("County is required"),
    neighbourHood: Yup.string().required("Neighbourhood is required"),
  });
  const {
    register: registerlocation,
    setValue: setLocationValues,
    handleSubmit: handleLocationSubmit,
    formState: { errors: locationerrors, isValid: locationIsValid },
  } = useForm({
    resolver: yupResolver(locationValidationSchema),
  });
  const onSubmitLocation = async (data) => {
    console.log(gpsdetails, "gpsdetails");
    if (gpsdetails === null) {
      Swal.fire({
        icon: "warning",
        title: "GPS Details Needed",
        text: "Please chose a place on the map",
        focusConfirm: false,
      });
    } else {
      dispatch(setValuationLocationDetails(data));
      props.next();
    }
  };
  // useEffect(() => {
  //   if (locationDetails != null) {
  //     setLocationValues("locationName", locationDetails?.locationName);
  //     setLocationValues("county", locationDetails?.county);
  //     setLocationValues("neighbourHood", locationDetails?.neighbourHood);
  //     setLocationValues("street", locationDetails?.street);
  //     setLocationValues("town", locationDetails?.town);

  //   }
  // }, [locationDetails])
  return (
    <form onSubmit={handleLocationSubmit(onSubmitLocation)}>
      <Row className="gy-4">
        <Col md="6" sm="12">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Location Name
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerlocation("locationName", { required: true })}
                defaultValue={locationDetails?.locationName}
              />
              {locationerrors.locationName && <span className="invalid">{locationerrors.locationName?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="last-name">
              County
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="last-name"
                className="form-control"
                {...registerlocation("county", { required: true })}
                defaultValue={locationDetails?.county}
              />
              {locationerrors.county && <span className="invalid">{locationerrors.county?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Town
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="email"
                className="form-control"
                {...registerlocation("town", {
                  required: true,
                })}
                defaultValue={locationDetails?.town}
              />
              {locationerrors.email === "required" && <span className="invalid">{locationerrors.town?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="phone-no">
              Street
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="phone-no"
                className="form-control"
                {...registerlocation("street", { required: true })}
                defaultValue={locationDetails?.street}
              />
              {locationerrors.street && <span className="invalid">{locationerrors.neighbourHood?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="city">
              Neighbourhood
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="city"
                className="form-control"
                {...registerlocation("neighbourHood", { required: true })}
                defaultValue={locationDetails?.neighbourHood}
              />
              {locationerrors.neighbourHood && <span className="invalid">{locationerrors.neighbourHood?.message}</span>}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md="12">
          <div className="form-group">
            <MapWithAutoSearch />
          </div>
        </Col>
      </Row>

      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type="submit">
              Next
            </Button>
          </li>
        </ul>
      </div>
    </form>
  );
};
const PropertyDetailsForm = (props) => {
  const [propertdetails, setPropertdetails] = useState(useSelector(selectPropertyDetails));
  // console.log(propertdetails);
  const dispatch = useDispatch();
  const propertyDetailsSchema = Yup.object().shape({
    PropertyLR: Yup.string().required("The proprty Lr is required"),
    PropertyType: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string(),
          label: Yup.string(),
        })
      )
      .min(1, "Property tYPE required")
      .max(1, "Only one Property Type is required."),
    totalBuiltUpArea: Yup.number().required("Total Builtup area is required"),
    tenure: Yup.string().required("Tenure is required"),
    landSize: Yup.number().required("Land size is required"),
  });
  const {
    register: registerproperty,
    control,
    setValue: setPropertyDetailsValues,
    handleSubmit: handlePropertyDetailsSubmit,
    formState: { errors: properrtyErrors, isValid: propertyDetailsIsValid },
  } = useForm({
    resolver: yupResolver(propertyDetailsSchema),
  });
  const onSubmitPropertyDetails = async (data) => {
    // console.log(data);
    dispatch(setValuationPropertyDetails(data));
    props.next();
  };
  //get the registered propertytypes
  const [selectedPropertyType, setSelectedPropertyType] = useState();

  const [propertytypesList, setpropertytypesList] = useState();
  useEffect(() => {});

  const { data: registeredpropertytypes, isLoading: loadingpropertytypes } = useGetPropertyTypeListQuery();
  // console.log(registeredpropertytypes, "registeredpropertytypes");
  useEffect(() => {
    if (registeredpropertytypes != undefined) {
      const restructuredData = registeredpropertytypes.map(({ id, type_name }) => ({
        id: id,
        value: id,
        label: type_name,
      }));
      setpropertytypesList(restructuredData);
    }
    if (propertdetails != null) {
      setPropertyDetailsValues("PropertyType", propertdetails?.PropertyType);
    }
  }, [loadingpropertytypes, propertdetails]);
  //get the registered propertytypes

  const animatedComponents = makeAnimated();

  return (
    <form onSubmit={handlePropertyDetailsSubmit(onSubmitPropertyDetails)}>
      <Row className="gy-4">
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Property LR
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="username"
                className="form-control"
                {...registerproperty("PropertyLR", { required: true })}
                defaultValue={propertdetails?.PropertyLR}
              />
              {properrtyErrors.PropertyLR && <span className="invalid">{properrtyErrors.PropertyLR?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          {/* <div className="form-group">
            <label className="form-label" htmlFor="password">
              Property Type
            </label>
            <div className="form-control-wrap">
              <RSelect
                isMulti
                components={animatedComponents}
                options={options}
                {...registerproperty("PropertyType", {
                  required: "This field is required"
                })}

              />
              {properrtyErrors?.PropertyType && <span className="invalid">{properrtyErrors.PropertyType?.message}</span>}
            </div>
          </div> */}
          <div className="form-group">
            <label className="form-label" htmlFor="fw-token-address">
              Property Type
            </label>
            <div className="form-control-wrap">
              {propertytypesList && propertytypesList.length > 0 && (
                <Controller
                  name="PropertyType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isMulti
                      value={propertdetails?.PropertyType}
                      options={propertytypesList}
                      isSearchable={true}
                      isClearable={true}
                      {...field}
                    />
                  )}
                />
              )}
              {properrtyErrors.PropertyType && (
                <span className="invalid" style={{ color: "#e85347", fontSize: "11px", fontStyle: "italic" }}>
                  {properrtyErrors.PropertyType?.message}
                </span>
              )}
            </div>
          </div>
        </Col>
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
              Total Built Up Area
            </label>
            <div className="form-control-wrap">
              <input
                type="totalBuiltUpArea"
                id="totalBuiltUpArea"
                className="form-control"
                {...registerproperty("totalBuiltUpArea", {
                  required: "This field is required",
                })}
                defaultValue={propertdetails?.landSize}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
              Land Size
            </label>
            <div className="form-control-wrap">
              <input
                type="landSize"
                id="landSize"
                className="form-control"
                {...registerproperty("landSize", {
                  required: "This field is required",
                })}
                defaultValue={propertdetails?.landSize}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
              Tenure
            </label>
            <div className="form-control-wrap">
              <input
                type="tenure"
                id="tenure"
                className="form-control"
                {...registerproperty("tenure", {
                  required: "This field is required",
                })}
                defaultValue={propertdetails?.tenure}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
      </Row>

      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type="submit">
              Next
            </Button>
          </li>
          <li>
            <Button color="primary" onClick={props.prev}>
              Previous
            </Button>
          </li>
        </ul>
      </div>
    </form>
  );
};
const PropertyValuationForm = (props) => {
  const dispatch = useDispatch();

  let recipientrecipientsList = useSelector(selectRecipientRecipients);
  console.log(recipientrecipientsList, "recipientrecipientsList");
  const [rerender, setRerender] = useState(false);
  const propertd = useSelector(selectPropertyDetails);
  const { data: ccurrentuploadedfile, refetch: refetchUploadedFile } = useGetCurrentUploadedFileQuery();

  const propertyValuationValidationSchema = Yup.object().shape({
    marketValue: Yup.string().required("Market Value is required"),
    forcedSaleValue: Yup.number().required("Forced Sale value is required").typeError("FSV must be a valid number"),
    insurenceValue: Yup.number()
      .required("Insurence Value is required")
      .typeError("Insurence value must be a valid number"),
    valuationDate: Yup.string().required("Valuation date is required"),
    annualGRossRentalIncome: Yup.number().required("Valuation date is required"),
    PropertyDescription: Yup.string(),
    InstructionDate: Yup.string().required("Instruction Date is required"),
    recipient: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string(),
          label: Yup.string(),
          name: Yup.string(),
        })
      )
      .min(1, "Recipient required")
      .max(1, "Only one recipient is required."),
    reportDocument: Yup.mixed()
      .required("Please upload a file")
      .nullable()
      .test("fileSize", "File size is too large", (value) => {
        if (value[0]) {
          return value[0].size <= 1024 * 1024 * 2;
        }
        return true;
      })
      .test("fileType", "Only PDF files are allowed", (value) => {
        if (value[0]) {
          return ["application/pdf", "pdf"].includes(value[0].type);
        }
        return true;
      }),
  });
  const {
    register: registerpropertyValuation,
    control,
    setValue: setPropertValuationValues,
    getValues: getValuationFormValuation,
    handleSubmit: handlePropertyValuationsSubmit,
    formState: { errors: propertyValuationErrors, isValid: propertyValuationIsValid },
  } = useForm({
    resolver: yupResolver(propertyValuationValidationSchema),
  });
  const [receivingUsers, setReceivingUsers] = useState([]);
  let valauationdetails = useSelector(selectValuationDetails);

  // console.log(valauationdetails, "valauationdetails");
  const recipientdetails = useSelector(selectCurrentRecipient);
  const [existingAccessors, setExistingAccessors] = useState();
  useEffect(() => {
    // setValauationdetails();
    if (valauationdetails != null) {
      setPropertValuationValues("recipient", valauationdetails?.recipient);
      setRecipientUsernames(valauationdetails?.report_user_name);
      setRecipientEmails(valauationdetails?.report_user_email);
      setRecipientPhone(valauationdetails?.report_user_phone);
    }
  }, [valauationdetails, recipientdetails]);
  const {
    data: accesorslist,
    isLoading: loadingAccesors,
    isSuccess: accesorsLoaded,
    isError: errorLodingAccesors,
    error: loadingAccesorError,
  } = useGetAccesorsListQuery();
  // console.log("Accesors List");
  // console.log(accesorslist);
  useEffect(() => {
    if (accesorslist != undefined) {
      const restructuredData = accesorslist.map(({ id, organization_name }) => ({
        value: id,
        label: organization_name,
        name: organization_name,
      }));
      setExistingAccessors(restructuredData);
    }
  }, [accesorslist]);
  const onSubmitPropertyValuation = async (data) => {
    console.log(data, "recipientrecipientsListrecipientrecipientsList");
    let revisedarray = null;
    if (data.recipientss) {
      let ind = 0;
      for (const recipientObject of data.recipientss) {
        // Dispatch an action for each recipientObject

        dispatch(setRecipientRecipients(data.recipientss[ind]));

        ind++;
      }
    }

    //
    // console.log(data, "data");
    delete data.reportDocument;
    dispatch(setValuationDetails(data));
    dispatch(setReportRecipient(data.recipient));

    if (existingAccessors.length > 0) {
      props.next();
    } else {
      alert("Please input figure");
    }
  };

  const [cacheReportDocument, setCachedREport] = useCacheReportDocumentMutation();
  const handleImage = async (e) => {
    let selectedRecipient = getValuationFormValuation("recipient");
    if (selectedRecipient == null) {
      Swal.fire({
        icon: "warning",
        title: "Uploading Image",
        text: "Please choose a recipient first",
        focusConfirm: false,
      });
    } else {
      const formdataFile = new FormData();
      const file = e.target.files[0];
      if (file && (file instanceof Blob || file instanceof File)) {
        // setSelectedFile(file);
        ///save placeholder
        formdataFile.append("report_pdf", e.target.files[0]);
        formdataFile.append("recipient", selectedRecipient[0].value);
        formdataFile.append("lrnumber", propertd?.PropertyLR);
        const result = await cacheReportDocument(formdataFile);
        refetchUploadedFile();
        console.log(result);
        ///save placeholder
      }
    }
  };
  // Function to add a new recipient row
  const addRecipient = () => {
    setReceivingUsers([...receivingUsers, {}]);
    // setRecipientRecipients({ 'name': '', 'email': '', 'phone': '' });
  };
  // Function to remove a recipient row
  const removeRecipient = (index) => {
    const updatedRecipients = [...receivingUsers];
    updatedRecipients.splice(index, 1);
    setReceivingUsers(updatedRecipients);
    dispatch(upDateRecipientRecipients(index));
  };
  const removeRecipientold = (index) => {
    dispatch(upDateRecipientRecipients(index));
    console.log(valauationdetails, "valauationdetailsaupold");
  };
  const updateOldRecipientProperty = (index, property, updatedValue) => {
    dispatch(upDateRecipientRecipientsProperty({ index: index, property: property, value: updatedValue }));
  };

  const token = useSelector(selectCurrentToken);
  const downloadReport = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/api/uploader/donwload-cached-image?file=${ccurrentuploadedfile?.file_name}`,
        { headers, responseType: "blob" }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = ccurrentuploadedfile?.file_name; // Replace with the actual filename
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handlePropertyValuationsSubmit(onSubmitPropertyValuation)}>
      <Row className="gy-3">
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="fw-token-address">
              Recipient Organization
            </label>
            <div className="form-control-wrap">
              {existingAccessors && existingAccessors.length > 0 && (
                <Controller
                  name="recipient"
                  control={control}
                  render={({ field }) => (
                    <Select isMulti options={existingAccessors} isSearchable={true} isClearable={true} {...field} />
                  )}
                />
              )}
              {propertyValuationErrors.recipient?.message}
              {propertyValuationErrors.recipient && (
                <span className="invalid">{propertyValuationErrors.recipient?.message}</span>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md="12">
          <div className="form-group">
            <label className="form-label">Recipients within The receiving Organization</label>
            <table className="table table-bordered table-responsive">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>
                    <Button color="primary" onClick={addRecipient}>
                      +
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {recipientrecipientsList != null &&
                  recipientrecipientsList.map((existingRecipientRecipient, index) => (
                    <tr key={index}>
                      <td>
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <Controller
                              name={`recipientssold[${index}].name`}
                              defaultValue={existingRecipientRecipient?.name ? existingRecipientRecipient?.name : ""}
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="text"
                                  {...field}
                                  className="form-control"
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    updateOldRecipientProperty(index, 1, updatedValue);
                                    field.onChange(e);
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <Controller
                              name={`recipientssold[${index}].email`}
                              control={control}
                              defaultValue={existingRecipientRecipient?.email ? existingRecipientRecipient?.email : ""}
                              render={({ field }) => (
                                <input
                                  type="text"
                                  {...field}
                                  className="form-control"
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    updateOldRecipientProperty(index, 2, updatedValue);
                                    field.onChange(e);
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <Controller
                              name={`recipientssold[${index}].phone`}
                              defaultValue={existingRecipientRecipient?.phone ? existingRecipientRecipient?.phone : ""}
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="text"
                                  {...field}
                                  className="form-control"
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    updateOldRecipientProperty(index, 3, updatedValue);
                                    field.onChange(e);
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <button type="button" onClick={() => removeRecipientold(index)} className="btn btn-danger">
                          -
                        </button>
                      </td>
                    </tr>
                  ))}
                {receivingUsers.map((receivingUsers, index) => (
                  <tr key={index}>
                    <td>
                      <div className="form-group">
                        <div className="form-control-wrap">
                          <Controller
                            name={`recipientss[${index}].name`}
                            // defaultValue={(valauationdetails?.recipientss[index]?.name) ? valauationdetails?.recipientss[index]?.name : ''}
                            control={control}
                            render={({ field }) => <input type="text" {...field} className="form-control" />}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="form-group">
                        <div className="form-control-wrap">
                          <Controller
                            name={`recipientss[${index}].email`}
                            control={control}
                            // defaultValue={(valauationdetails?.recipientss[index]?.email) ? valauationdetails?.recipientss[index]?.email : ''}
                            render={({ field }) => <input type="text" {...field} className="form-control" />}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="form-group">
                        <div className="form-control-wrap">
                          <Controller
                            name={`recipientss[${index}].phone`}
                            // defaultValue={(valauationdetails?.recipientss[index]?.phone) ? valauationdetails?.recipientss[index]?.phone : ''}
                            control={control}
                            render={({ field }) => <input type="text" {...field} className="form-control" />}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <button type="button" onClick={() => removeRecipient(index)} className="btn btn-danger">
                        -
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md="12">
          <div className="form-group">
            <label className="form-label">Report Document(Only PDF)</label>
            <div className="form-control-wrap">
              <div className="form-file">
                <input
                  className="form-control"
                  {...registerpropertyValuation("reportDocument", { required: true })}
                  type="file"
                  multiple
                  id="customMultipleFiles"
                  onChange={handleImage}
                />
                {propertyValuationErrors.file?.message}
                {propertyValuationErrors.recipient && (
                  <span className="invalid">{propertyValuationErrors.file?.message}</span>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md="12">
          {ccurrentuploadedfile && ccurrentuploadedfile.file_name != "" && (
            <Alert color="primary">
              {/* <a
                href={`${process.env.REACT_APP_API_BASE_URL}/api/uploader/donwload-cached-image?file=${ccurrentuploadedfile.file_name}`}
              > */}
              <Button color="primary" onClick={downloadReport}>
                Preview Uploaded Report Document
              </Button>
              {/* </a> */}
            </Alert>
          )}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md="4">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Market Value
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("marketValue", { required: true })}
                defaultValue={valauationdetails?.marketValue}
              />
              {propertyValuationErrors.marketValue?.message}
              {propertyValuationErrors.marketValue && (
                <span className="invalid">{propertyValuationErrors.marketValue?.message}</span>
              )}
            </div>
          </div>
        </Col>
        <Col md="4">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Forced Sale Value
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="forcedSaleValue"
                className="form-control"
                {...registerpropertyValuation("forcedSaleValue", { required: true })}
                defaultValue={valauationdetails?.forcedSaleValue}
              />
              {propertyValuationErrors?.forcedSaleValue?.message}
              {propertyValuationErrors.forcedSaleValue && (
                <span className="invalid">{propertyValuationErrors.forcedSaleValue?.message}</span>
              )}
            </div>
          </div>
        </Col>
        <Col md="4">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Insurence Value
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("insurenceValue", { required: true })}
                defaultValue={valauationdetails?.insurenceValue}
              />
              {propertyValuationErrors?.insurenceValue?.message}
              {propertyValuationErrors.insurenceValue && (
                <span className="invalid">{propertyValuationErrors.insurenceValue?.message}</span>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Annual Grooss Income
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="annualGRossRentalIncome"
                className="form-control"
                {...registerpropertyValuation("annualGRossRentalIncome", { required: true })}
                defaultValue={valauationdetails?.annualGRossRentalIncome}
              />
              {propertyValuationErrors?.annualGRossRentalIncome?.message}
              {propertyValuationErrors.annualGRossRentalIncome && (
                <span className="invalid">{propertyValuationErrors.annualGRossRentalIncome?.message}</span>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Valuation Date
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("valuationDate", { required: true })}
                defaultValue={valauationdetails?.valuationDate}
              />
              {propertyValuationErrors.valuationDate?.message}
              {propertyValuationErrors.valuationDate && (
                <span className="invalid">{propertyValuationErrors.valuationDate?.message}</span>
              )}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Instruction Date
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("InstructionDate", { required: true })}
                defaultValue={valauationdetails?.InstructionDate}
              />
              {propertyValuationErrors.InstructionDate?.message}
              {propertyValuationErrors.InstructionDate && (
                <span className="invalid">{propertyValuationErrors.InstructionDate?.message}</span>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Property Description
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="PropertyDescription"
                className="form-control"
                {...registerpropertyValuation("PropertyDescription", { required: true })}
                defaultValue={valauationdetails?.PropertyDescription}
              />
              {propertyValuationErrors.InstructionDate?.message}
              {propertyValuationErrors.InstructionDate && (
                <span className="invalid">{propertyValuationErrors.InstructionDate?.message}</span>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </li>
          <li>
            <Button color="primary" onClick={props.prev}>
              Previous
            </Button>
          </li>
        </ul>
      </div>
    </form>
  );
};
const ValuationSignatures = (props) => {
  const { data: ccurrentuploadedfile, refetch: refetchUploadedFile } = useGetCurrentUploadedFileQuery();
  const token = useSelector(selectCurrentToken);
  const downloadReport = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/api/uploader/donwload-cached-image?file=${ccurrentuploadedfile?.file_name}`,
        { headers, responseType: "blob" }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = ccurrentuploadedfile?.file_name; // Replace with the actual filename
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const myreportdocdetails = localStorage.getItem("my_reportdocument");
  console.log("myreportdocdetails", myreportdocdetails);
  const reportsignatories = useSelector(selectCurrentSignatories);
  // console.log(reportsignatories, "reportsignatories");
  const dispatch = useDispatch();
  const signatoriesSchema = Yup.object().shape({
    repportSinatories: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.string(),
          value: Yup.string(),
          label: Yup.string(),
          email: Yup.string(),
          phone: Yup.string(),
        })
      )
      .min(2, "Signatories are required")
      .max(2, "Only one Property Type is required."),
  });
  const {
    register: registerSignatories,
    control,
    setValue: setSignatoriesValues,
    handleSubmit: handleSignatories,
    formState: { errors: signatoriesErrors },
  } = useForm({
    resolver: yupResolver(signatoriesSchema),
  });
  const onSubmitSignatories = async (data) => {
    // console.log(data);
    console.log("submitted signatories", data);
    dispatch(setReportSignatories(data));
    props.next();
  };
  //get the registered signatories
  const [signatoriesList, setSignatoriesList] = useState();
  const { data: registeredusers, isLoading: loadingusers } = useGetUsersQuery({});
  console.log(registeredusers, "registeredusers");
  useEffect(() => {
    if (registeredusers != undefined) {
      const restructuredData = registeredusers?.data.map(({ id, full_name, email, phone }) => ({
        id: id,
        value: id,
        label: full_name,
        email: email,
        phone: phone,
      }));
      setSignatoriesList(restructuredData);
    }
    if (reportsignatories != null) {
      setSignatoriesValues("signatories", reportsignatories?.signatories);
    }
  }, [loadingusers, reportsignatories]);
  //get the registered signnaries
  const animatedComponents = makeAnimated();
  return (
    <form onSubmit={handleSignatories(onSubmitSignatories)}>
      <Row className="gy-4">
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="fw-token-address">
              Signatories
            </label>
            <div className="form-control-wrap">
              {signatoriesList && signatoriesList.length > 0 && (
                <Controller
                  name="signatories"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isMulti
                      value={reportsignatories?.signatories}
                      options={signatoriesList}
                      isSearchable={true}
                      isClearable={true}
                      {...field}
                    />
                  )}
                />
              )}
              {signatoriesErrors.signatories && (
                <span className="invalid" style={{ color: "#e85347", fontSize: "11px", fontStyle: "italic" }}>
                  {signatoriesErrors.signatories?.message}
                </span>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type="submit">
              Next
            </Button>
          </li>
          <li>
            <Button color="primary" onClick={props.prev}>
              Previous
            </Button>
          </li>
        </ul>
      </div>
    </form>
  );
};
const ValuationSummary = (props) => {
  const dispatch = useDispatch();
  let recipientrecipientsList = useSelector(selectRecipientRecipients);
  console.log(recipientrecipientsList, "summary recipientrecipientsList");
  const { data: ccurrentuploadedfile, refetch: refetchUploadedFile } = useGetCurrentUploadedFileQuery();
  const propertdetails = useSelector(selectPropertyDetails);
  const locationdetails = useSelector(selectLocationDetails);
  const valuationdetails = useSelector(selectValuationDetails);
  const signatories = useSelector(selectCurrentSignatories);
  const gpsdetails = useSelector(selectGPSDetails);
  console.log(gpsdetails, "gpsdetails");
  const recipientrecipients = valuationdetails?.recipientss;
  const reportdocument = localStorage.getItem("my_reportdocument");
  console.log(propertdetails, "propertdetails");
  console.log(locationdetails, "locationdetails");
  console.log(valuationdetails, "valutiondetails");
  console.log(signatories?.signatories, "signatories");
  console.log(recipientrecipients, "recipientrecipient");
  const [submitvaluationreport, { errors: errorsuploadingreport, isLoading: isSubmittingReport }] =
    useSubmitValuationReportMutation();
  const token = useSelector(selectCurrentToken);
  const downloadReport = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/api/uploader/donwload-cached-image?file=${ccurrentuploadedfile?.file_name}`,
        { headers, responseType: "blob" }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = ccurrentuploadedfile?.file_name; // Replace with the actual filename
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleSubmitValuationReport = async (type) => {
    const formdata = new FormData();
    formdata.append("e_location_name", locationdetails?.locationName);
    formdata.append("e_location_county", locationdetails?.county);
    formdata.append("e_location_town", locationdetails?.town);
    formdata.append("e_location_street", locationdetails?.street);

    formdata.append("e_location_neighbourhood", locationdetails?.neighbourHood);
    if (gpsdetails.type === "auto") {
      formdata.append("a_location_lat", gpsdetails?.details.lat);
      formdata.append("a_location_long", gpsdetails?.details.long);
      formdata.append("a_location_city", gpsdetails?.details.name);
      formdata.append("a_location_town", gpsdetails?.details.name);
      formdata.append("a_location_street", gpsdetails?.details.name);
    } else if (gpsdetails.type === "custom") {
      formdata.append("a_location_lat", gpsdetails?.details.lat);
      formdata.append("a_location_long", gpsdetails?.details.long);
      formdata.append("a_location_city", gpsdetails?.details.name);
      formdata.append("a_location_town", gpsdetails?.details.name);
      formdata.append("a_location_street", gpsdetails?.details.name);
    }

    formdata.append("propertyLR", propertdetails?.PropertyLR);
    formdata.append("propertyType", propertdetails?.PropertyType[0].value);
    formdata.append("totalBultUpArea", propertdetails?.totalBuiltUpArea);
    formdata.append("landSize", propertdetails?.landSize);
    formdata.append("tenure", propertdetails?.tenure);
    formdata.append("recipientOrg", valuationdetails?.recipient[0].value);

    const recnames = [];
    const reemails = [];
    const rephones = [];
    for (const item of recipientrecipientsList) {
      recnames.push(item.name);
      reemails.push(item.email);
      rephones.push(item.phone);
    }

    formdata.append("recipientUsersnames", [recnames]);
    formdata.append("recipientUsersemails", [reemails]);
    formdata.append("recipientUserphones", [rephones]);
    formdata.append("marketValue", valuationdetails?.marketValue);
    formdata.append("forcedSaleValue", valuationdetails?.forcedSaleValue);
    formdata.append("insurenceValue", valuationdetails?.insurenceValue);
    formdata.append("annualGrossVRevenue", valuationdetails?.annualGRossRentalIncome);
    formdata.append("valuationDate", valuationdetails?.valuationDate);
    formdata.append("instructionDate", valuationdetails?.InstructionDate);
    formdata.append("propertyDescription", valuationdetails?.PropertyDescription);

    const signs = [];

    for (const item of signatories?.signatories) {
      signs.push(item.value);
    }
    formdata.append("signatories", signs);

    if (type === "1") {
      formdata.append("signatureNeeded", 1);
    } else {
      formdata.append("signatureNeeded", 0);
    }
    // console.log(recnames);
    const submitvaluationreportresutlt = await submitvaluationreport(formdata);
    if ("error" in submitvaluationreportresutlt) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: submitvaluationreportresutlt.error.data.message,
        focusConfirm: false,
      });
    } else {
      dispatch(clearValuationReportData());
      Swal.fire({
        icon: "success",
        title: "Upload Of A valuation report",
        text: submitvaluationreportresutlt.data.message,
        focusConfirm: false,
      });
      // toastMessage(result.data.message, "success");

      // resetInvestmenrForm();
    }
  };

  const [isOpen, setIsOpen] = useState("1");
  return (
    <>
      <div className="accordion">
        <div className="accordion-item">
          <div className="accordion-head" onClick={() => setIsOpen("1")}>
            <h6 className="title">Location Details</h6>
            <span className="accordion-icon"></span>
          </div>
          <Collapse className="accordion-body" isOpen={isOpen === "1" ? true : false}>
            <div className="accordion-inner">
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="rating-card">
                    <div
                      className="d-flex align-center justify-content-between py-1 "
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Location Name:</span>
                      {locationdetails?.locationName}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">County</span>
                      {locationdetails?.county}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Town</span>
                      {locationdetails?.town}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Street</span>
                      {locationdetails?.street}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Neighbourhood</span>
                      {locationdetails?.neighbourHood}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">GPS Location Name</span>
                      {locationdetails?.locationName}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">GPS Latitude</span>
                      {gpsdetails?.lat}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">GPS Longitude</span>
                      {locationdetails?.long}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Collapse>
        </div>
        <div className="accordion-item">
          <div className="accordion-head collapsed" onClick={() => setIsOpen("2")}>
            <h6 className="title">Property Details</h6>
            <span className="accordion-icon"></span>
          </div>
          <Collapse className="accordion-body" isOpen={isOpen === "2" ? true : false}>
            <div className="accordion-inner">
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="rating-card">
                    <div
                      className="d-flex align-center justify-content-between py-1 "
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Property LR:</span>
                      {propertdetails?.PropertyLR}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Property Type:</span>
                      {propertdetails?.PropertyType[0].label}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Total Built Up Area:</span>
                      {propertdetails?.totalBuiltUpArea}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Land Size:</span>
                      {propertdetails?.landSize}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Tenure</span>
                      {propertdetails?.tenure}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Collapse>
        </div>
        <div className="accordion-item">
          <div className="accordion-head collapsed" onClick={() => setIsOpen("3")}>
            <h6 className="title">Valuation Details</h6>
            <span className="accordion-icon"></span>
          </div>
          <Collapse className="accordion-body" isOpen={isOpen === "3" ? true : false}>
            <div className="accordion-inner">
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="rating-card">
                    <div
                      className="d-flex align-center justify-content-between py-1 "
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Recipient:</span>
                      {valuationdetails?.recipient[0]?.label}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Market Value:</span>
                      {valuationdetails?.marketValue}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Forced Sale Value:</span>
                      {valuationdetails?.forcedSaleValue}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Insurence Value:</span>
                      {valuationdetails?.insurenceValue}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Annual Grooss Income:</span>
                      {valuationdetails?.annualGRossRentalIncome}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Valuation Date:</span>
                      {valuationdetails?.valuationDate}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Instruction Date</span>
                      {valuationdetails?.InstructionDate}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Property Description:</span>
                      {valuationdetails?.PropertyDescription}
                    </div>
                    <div
                      className="d-flex align-center justify-content-between py-1"
                      style={{ borderBottom: "0.5px solid #EAEDED" }}
                    >
                      <span className="text-muted">Report Uploaded:</span>
                      {ccurrentuploadedfile && ccurrentuploadedfile?.file_name != "" && (
                        <Alert color="primary">
                          {/* <a
                href={`${process.env.REACT_APP_API_BASE_URL}/api/uploader/donwload-cached-image?file=${ccurrentuploadedfile.file_name}`}
              > */}
                          <Button color="primary" onClick={downloadReport}>
                            Preview Uploaded Report Document
                          </Button>
                          {/* </a> */}
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Collapse>
        </div>
        <div className="accordion-item">
          <div className="accordion-head collapsed" onClick={() => setIsOpen("4")}>
            <h6 className="title">Recipients Within Recipient Organization</h6>
            <span className="accordion-icon"></span>
          </div>
          <Collapse className="accordion-body" isOpen={isOpen === "4" ? true : false}>
            <div className="accordion-inner">
              <Card className="card-bordered">
                <div className="card-inner">
                  <table className="table table-responsive">
                    <thead>
                      <tr>
                        <th scope="col">Full Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipientrecipientsList &&
                        recipientrecipientsList != null &&
                        recipientrecipientsList.map((rec, index) => {
                          return (
                            <tr key={index}>
                              <td>{rec?.name}</td>
                              <td>{rec?.email}</td>
                              <td>{rec?.phone}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </Collapse>
        </div>
        <div className="accordion-item">
          <div className="accordion-head collapsed" onClick={() => setIsOpen("4")}>
            <h6 className="title">Signatories.</h6>
            <span className="accordion-icon"></span>
          </div>
          <Collapse className="accordion-body" isOpen={isOpen === "4" ? true : false}>
            <div className="accordion-inner">
              <Card className="card-bordered">
                <div className="card-inner">
                  <table className="table table-responsive">
                    <thead>
                      <tr>
                        <th scope="col">Full Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signatories?.signatories.map((rec, index) => {
                        return (
                          <tr key={index}>
                            <td>{rec?.label}</td>
                            <td>{rec?.email}</td>
                            <td>{rec?.phone}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </Collapse>
        </div>
      </div>
      <div className="actions clearfix m-20">
        <ul>
          <li>
            <Button
              color="primary"
              type="submit"
              onClick={() => handleSubmitValuationReport("1")}
              disabled={isSubmittingReport}
            >
              {!isSubmittingReport && <span>Submit Report To Lender</span>}
              {isSubmittingReport && (
                <>
                  <Spinner size="sm" />
                  <span> Submitting to Lender... </span>
                </>
              )}
            </Button>
          </li>
          <li>
            <Button
              color="primary"
              type="submit"
              onClick={() => handleSubmitValuationReport("0")}
              disabled={isSubmittingReport}
            >
              {!isSubmittingReport && <span>Send Report to Signatories</span>}
              {isSubmittingReport && (
                <>
                  <Spinner size="sm" />
                  <span> Submitting to Signatories... </span>
                </>
              )}
            </Button>
          </li>
          <li>
            <Button color="primary" onClick={props.prev} disabled={isSubmittingReport}>
              {!isSubmittingReport && <span>Previous</span>}
              {isSubmittingReport && (
                <>
                  <Spinner size="sm" />
                  <span> Submitting to Signatories... </span>
                </>
              )}
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};
const Success = (props) => {
  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <BlockTitle tag="h6" className="text-center">
        Thank you for submitting form
      </BlockTitle>
    </div>
  );
};

const Header = (props) => {
  return (
    <div className="steps clearfix">
      <ul>
        <li className={props.current >= 1 ? "first done" : "first"}>
          <a href="#wizard-01-h-0" onClick={(ev) => ev.preventDefault()}>
            <span className="number"> Step 1</span>
            <h5>Property Location </h5>
          </a>
        </li>
        <li className={props.current >= 2 ? "done" : ""}>
          <a href="#wizard-01-h-1" onClick={(ev) => ev.preventDefault()}>
            <span className="number">Step 02</span> <h5>Property Details</h5>
          </a>
        </li>
        <li className={props.current >= 3 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            {/* <span className="current-info audible">current step: </span> */}
            <span className="number">03</span> <h5>Valuation Details</h5>
          </a>
        </li>
        <li className={props.current >= 4 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            {/* <span className="current-info audible">current step: </span> */}
            <span className="number">04</span> <h5>Signatories</h5>
          </a>
        </li>
        <li className={props.current >= 5 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="number">05</span> <h5>Summary</h5>
          </a>
        </li>
        <li className={props.current === 6 ? "last done" : "last"}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            {/* <span className="current-info audible"> </span> */}
            <span className="number">06</span> <h5>Success</h5>
          </a>
        </li>
      </ul>
    </div>
  );
};
const config = {
  before: Header,
};
const ReportSubmit = () => {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Card
        className="card-bordered"
        style={{
          height: "60%",
          width: "80%",
          marginTop: "140px",
          marginBottom: "10%",
          padding: "3%",
          overflow: "auto",
        }}
      >
        <React.Fragment>
          <div className="nk-wizard nk-wizard-simple is-alter wizard clearfix">
            <Steps config={config}>
              <Step component={LocationForm} />
              <Step component={PropertyDetailsForm} />
              <Step component={PropertyValuationForm} />
              <Step component={ValuationSignatures} />
              <Step component={ValuationSummary} />
              <Step component={Success} />
            </Steps>
          </div>
        </React.Fragment>
      </Card>
    </div>
  );
};
export default ReportSubmit;
