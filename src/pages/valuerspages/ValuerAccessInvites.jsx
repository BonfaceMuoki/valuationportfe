import React, { useState, useEffect } from "react";
import {
  BlockHead,
  BlockHeadContent,
  PreviewCard,
  Icon,
  Row,
  Col,
  UserAvatar,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  RSelect,
} from "../../components/Component";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";
import { bulkActionOptions, findUpper } from "../../utils/Utils";
import {
  useApproveValuationFirmRequestMutation,
  useGetValuationFirmRequestsQuery,
  useRejectValuationFirmRequestMutation,
} from "../../api/admin/valuationFirmRequestsSlice";
import {
  useArchiveUploaderRegistrationRequestMutation,
  useRequestUploaderRegistrationStatusQuery,
} from "../../api/auth/inviteValuerApiSlice";

import Swal from "sweetalert2";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import CompanySummary from "../../components/CompanySummary";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const ValuerAccessInvites = () => {
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

  const [modalSm, setModalSm] = useState(false);
  const toggleSm = () => setModalSm(!modalSm);

  const [modalOpenCompanyDetails, setModaOpenCompanyDetails] = useState(false);
  const toggleOpenCompanyDetails = () => setModaOpenCompanyDetails(!modalOpenCompanyDetails);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(3);

  const {
    data,
    isFetching,
    isLoading,
    refetch: refetchFirmRequests,
    isSuccess,
    isError,
    error,
  } = useGetValuationFirmRequestsQuery({
    currentPage: currentPage,
    rowsPerPage: itemPerPage,
    searchText: "",
    orderColumn: "name",
    sortOrder: "asc",
  });

  useEffect(() => {
    if (data?.requests) {
      setCurrentPage(data.requests.current_page);
      setItemPerPage(data.requests.per_page);
    }
  }, [data]);

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //actions
  const [acceptValuationAccessRequest, { isLoading: sendingUploaderInvite }] = useApproveValuationFirmRequestMutation();
  const [rejectValuationFirmRequest, { isloading: sendingReject }] = useRejectValuationFirmRequestMutation();
  const acceptRequest = (firm) => {
    console.log("Aproving");
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve " + firm?.valuationFirmName + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve!",
    }).then((result) => {
      if (result.isConfirmed) {
        acceptAcceptingRegistartion(firm?.id);
      } else {
        Swal.fire("Approval!", "Approval Cancelled.", "warning");
      }
    });
  };
  const frontendbaseurl = process.env.REACT_APP_FRONTEND_BASE_URL;
  const acceptAcceptingRegistartion = async (data) => {
    const jsonData = {
      requestId: data
  };
    const result = await acceptValuationAccessRequest(jsonData);
    if ("error" in result) {
      if ("backendvalerrors" in result.error.data) {
        // setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
    }
    refetchFirmRequests();
  };
  const [activeRequest, setActiveRequest] = useState(0);
  const [fullActiveRequest, setFullActiveRequest] = useState(null);
  const declineRequest = (row) => {
    setActiveRequest(row.id);
    setFullActiveRequest(row);
    setModalSm(true);
    // rejectValuationFirmRequest();
  };
  const submitDeclineRequest = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("invite", activeRequest);
    formData.append("reason", data.reasonForRejection);
    const result = await rejectValuationFirmRequest(formData);
    if ("error" in result) {
      if ("backendvalerrors" in result.error.data) {
        // setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
      refetchFirmRequests();
    }

    // rejectValuationFirmRequest();
  };
  ///intialize invite form
  ///intialize invite form
  //intialize edit form
  ///intialize edit form
  const [regOrgDetails, setRegOrgDetails] = useState();
  const { data: requestregdetails, isLoading: isLoadingRequestDetails } =
    useRequestUploaderRegistrationStatusQuery(activeRequest);
  useEffect(() => {
    if (requestregdetails?.orgdetails) {
      setRegOrgDetails(requestregdetails?.orgdetails);
    }
  }, [requestregdetails, isLoadingRequestDetails]);
  const viewRegistrationStatus = async (row) => {
    setActiveRequest(row.id);
    setFullActiveRequest(row);
    setModaOpenCompanyDetails(row);
  };
  const viewCompanyStatus = async (row) => {
    setActiveRequest(row.id);
  };
  const [archiveRequestt] = useArchiveUploaderRegistrationRequestMutation();
  const archiveRequest = async (row) => {
    const formData = new FormData();
    formData.append("invite", row.id);
    const result = await archiveRequestt(formData);
    if ("error" in result) {
      toastMessage(result.error.data.message, "error");
      if ("backendvalerrors" in result.error.data) {
      }
    } else {
      refetchFirmRequests();
    }
  };
  //actions
  const schema = yup.object().shape({
    reasonForRejection: yup.string().required("Reason is required"),
  });
  const {
    register: registerDeclineForm,
    handleSubmit: handleSubmitDeclineForm,
    formState: { errors: registerDeclineFormErrorrs },
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (data?.requests?.data) {
    return (
      <PreviewCard>
        {/* open modal decline */}
        <Modal size="sm" isOpen={modalOpenCompanyDetails} toggle={toggleOpenCompanyDetails}>
          <ModalHeader
            toggle={toggleOpenCompanyDetails}
            close={
              <button className="close" onClick={toggleOpenCompanyDetails}>
                <Icon name="cross" />
              </button>
            }
          >
            Company Information
          </ModalHeader>
          <ModalBody>
            <CompanySummary item={fullActiveRequest} companytypes="valuer" />
          </ModalBody>
          <ModalFooter className="bg-light"></ModalFooter>
        </Modal>
        {/* close modal for decline */}
        {/* open modal decline */}
        <Modal size="sm" isOpen={modalSm} toggle={toggleSm}>
          <ModalHeader
            toggle={toggleSm}
            close={
              <button className="close" onClick={toggleSm}>
                <Icon name="cross" />
              </button>
            }
          >
            Reason For Decline
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmitDeclineForm(submitDeclineRequest)}>
              <textarea
                placeholder="Reason for rejection / Instruction on the next action"
                fullWidth
                multiline
                rows={4}
                className="form-control"
                sx={{ mt: 3, mb: 3 }}
                {...registerDeclineForm("reasonForRejection")}
              />
              <span className="errorSpan"> {registerDeclineFormErrorrs.reasonForRejection?.message}</span>
              <Button type="submit" className="btn-round mt-3" color="primary">
                <Icon name="send" />
                <span>Submit</span>
              </Button>
            </form>
          </ModalBody>
          <ModalFooter className="bg-light"></ModalFooter>
        </Modal>
        {/* close modal for decline */}
       
        <BlockHeadContent>
          <h4 className="mb-1 text-uppercase fw-bold text-primary">
          Valuer Access Requests.
          </h4>
          <p className="text-muted small">Manage registration requests submitted by accessor firms</p>
        </BlockHeadContent>
 
        <DataTable className="card-stretch">
          <DataTableBody>
            <DataTableHead >
              <DataTableRow >
                <span className="sub-text" style={{ minHeight: "50px", display: "flex", alignItems: "center" }}>Company Name</span>
              </DataTableRow>
              <DataTableRow  >
                <span className="sub-text" style={{ minHeight: "50px", display: "flex", alignItems: "center" }}>ISK verification Details </span>
              </DataTableRow>
              <DataTableRow className="nk-tb-col-tools text-end" style={{ minHeight: "400px" }}>
                <span className="sub-text" style={{ minHeight: "50px", display: "flex", alignItems: "center" }}>Action</span>
              </DataTableRow>
            </DataTableHead>
            {/*Head*/}
            {data.requests.data.map((item, index) => {
              return (
                <DataTableItem key={`valuer-access-reqs-${item.id}`}>
                  <DataTableRow>
                    {/* <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}> */}
                      <div className="user-card">
                        <UserAvatar
                          theme={item.avatarBg}
                          text={findUpper(
                            item.valuationFirmName != null && item.valuationFirmName != undefined
                              ? item.valuationFirmName
                              : ""
                          )}
                          image=""
                        ></UserAvatar>
                        <div className="user-info">
                          <span className="tb-lead">
                            {item?.valuationFirmName}{" "}
                            <span
                              className={`dot dot-${
                                item.status === "Active"
                                  ? "success"
                                  : item?.status === "Pending"
                                  ? "warning"
                                  : "danger"
                              } d-md-none ms-1`}
                            ></span>
                          </span>
                          <span>{item?.inviteEmail}</span>
                        </div>
                      </div>
                    {/* </Link> */}
                  </DataTableRow>
                  <DataTableRow>
                    <span className="tb-amount">
                      <span className="tb-lead">
                        {" "}
                        <b>Dir Name</b> &nbsp;&nbsp;&nbsp; <span>{item?.directorName}</span>{" "}
                      </span>
                    </span>
                    <span className="tb-amount">
                      <span className="tb-lead">
                        {" "}
                        <b>ISK Number</b>:&nbsp;&nbsp;&nbsp; <span>{item?.iskNumber}</span>{" "}
                      </span>
                    </span>
                    <span className="tb-amount">
                      <span className="tb-lead">
                        {" "}
                        <b>VRB Number</b>&nbsp;&nbsp;&nbsp; <span>{item?.vrbNumber}</span>{" "}
                      </span>
                    </span>
                  </DataTableRow>
                  <DataTableRow className="nk-tb-col-tools">
                    <ul className="nk-tb-actions gx-1">
                      <li>
                        <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                            <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu end>
                            <ul className="link-list-opt no-bdr">
                              {item?.approvalStatus === "PENDING" && (
                                <React.Fragment>
                                  <li onClick={() => acceptRequest(item)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check"></Icon>
                                      <span>Approve</span>
                                    </DropdownItem>
                                  </li>
                                  <li className="divider"></li>
                                  <li onClick={() => declineRequest(item)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#suspend"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="cross"></Icon>
                                      <span>Decline</span>
                                    </DropdownItem>
                                  </li>
                                </React.Fragment>
                              )}
                              {item?.status === "Approved" && (
                                <React.Fragment>
                                  <li onClick={() => viewRegistrationStatus(item)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check"></Icon>
                                      <span>View Registration Status</span>
                                    </DropdownItem>
                                  </li>
                                </React.Fragment>
                              )}
                              {item?.status === "Rejected" && (
                                <React.Fragment>
                                  <li onClick={() => archiveRequest(item)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check"></Icon>
                                      <span>Archive Request</span>
                                    </DropdownItem>
                                  </li>
                                </React.Fragment>
                              )}
                              {item?.status === "Registered" && (
                                <React.Fragment>
                                  <li onClick={() => viewRegistrationStatus(item)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check"></Icon>
                                      <span>View Company Details</span>
                                    </DropdownItem>
                                  </li>
                                </React.Fragment>
                              )}
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </li>
                    </ul>
                  </DataTableRow>
                </DataTableItem>
              );
            })}
          </DataTableBody>
          <div className="card-inner">
            {data.requests.data.length > 0 ? (
              <PaginationComponent
                itemPerPage={data.requests.per_page}
                totalItems={data.requests.total}
                paginate={paginate}
                currentPage={data.requests.current_page}
              />
            ) : (
              <div className="text-center">
                <span className="text-silent">No data found</span>
              </div>
            )}
          </div>
        </DataTable>
      </PreviewCard>
    );
  } else {
  }
};
export default ValuerAccessInvites;
