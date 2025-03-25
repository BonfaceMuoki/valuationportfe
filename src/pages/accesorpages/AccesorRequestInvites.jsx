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
  useGetAccesorRequestsQuery,
  useApproveAccesorRequestMutation,
  useRejectAccesorRequestMutation,
} from "../../api/admin/accesorRequestsSlliceApi";
import { useArchiveAccesorRegistrationRequestMutation } from "../../api/auth/inviteAccesorApiSlice";

import Swal from "sweetalert2";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import CompanySummary from "../../components/CompanySummary";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const AccesorRequestInvites = () => {
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

  const [currentItems, setcurrentItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const {
    data,
    isFetching,
    isLoading,
    refetch: refetchFirmRequests,
    isSuccess,
    isError,
    error,
  } = useGetAccesorRequestsQuery(
    {
      currentPage: currentPage,
      rowsPerPage: itemPerPage,
      searchText: "",
      orderColumn: "name",
      sortOrder: "asc",
    }
  );

  // Add better debugging to understand the query state
  console.log('Query State:', {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    data
  });

  const [acceptAccesorAccessRequest, { isLoading: sendingUploaderInvite }] = useApproveAccesorRequestMutation();
  const [rejectValuationFirmRequest, { isloading: sendingReject }] = useRejectAccesorRequestMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setCurrentPage(data.requests.current_page);
      setItemPerPage(data.requests.per_page);
      console.error('Data loaded successfully', data);
      // setTableData(data);
    } else if (isError) {
      console.error('Error fetching accessor requests:', error);
      // setTableData([]);
    }
  }, [isSuccess, isError, data, error]);



 

  // const currentItems = ;
  const frontendbaseurl = process.env.REACT_APP_FRONT_BASE_URL;

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const approveFirm = (firm) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve " + firm?.institution_name + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        acceptAcceptingRegistartion(firm);
      } else {
        Swal.fire("Approval!", "Approval Cancelled.", "warning");
      }
    });
  };
  const declineFirm = (firm) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to decline " + firm?.institution_name + " request",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setActiveRequest(firm?.id);
        setModalSm(true);
        // submitDeclineRequest(firm);
      } else {
        Swal.fire("Decline!", "Decline Cancelled.", "success");
      }
    });
  };

  //process decline form
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
  // const [submitRequestDecline,]

  const acceptAcceptingRegistartion = async (data) => {
    const jsonData = {
      requestId:  data?.id
  };
    const result = await acceptAccesorAccessRequest(jsonData);
    if ("error" in result) {
      if ("backendvalerrors" in result.error.data) {
        setBackendValErrors(result.error.data.backendvalerrors);
        toastMessage(result?.error?.data?.message, "error");
      }
    } else {
      toastMessage(result?.data?.message, "success");
      refetchFirmRequests();
    }
 
    refetchFirmRequests();
  };
  const [activeRequest, setActiveRequest] = useState(0);
  const [fullActiveRequest, setFullActiveRequest] = useState(null);

  const submitDeclineRequest = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("invite", activeRequest);
    formData.append("reason", data.reasonForRejection);
    const result = await rejectValuationFirmRequest(formData);
    if ("error" in result) {
      Swal.fire("Decline!", result.error.data.message, "warning");
      if ("backendvalerrors" in result.error.data) {
      }
    } else {
      toastMessage(result.data.message, "success");
      refetchFirmRequests();
    }

    // rejectValuationFirmRequest();
  };

  const [archiveRequestt] = useArchiveAccesorRegistrationRequestMutation();
  const archiveRequest = async (row) => {
    const formData = new FormData();
    formData.append("invite", row.id);
    const result = await archiveRequestt(formData);
    if ("error" in result) {
      if ("backendvalerrors" in result.error.data) {
        // setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
      refetchFirmRequests();
    }
  };
  const viewCompanyStatus = async (row) => {
    toggleOpenCompanyDetails();
    setActiveRequest(row.id);
    setFullActiveRequest(row);
  };
  const viewRegistrationStatus = async (row) => {
    setFullActiveRequest(row);
    setActiveRequest(row.id);
    setModaOpenCompanyDetails(true);
  };
  if (data?.requests?.data?.length > 0) {
  
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
            <CompanySummary item={fullActiveRequest} companytypes="Accessor" />
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
        <BlockHead size="lg" wide="sm">
          <BlockHeadContent>Accesors Access Requests.</BlockHeadContent>
        </BlockHead>
        {/* <ReactDataTable data={DataTableData} columns={dataTableColumns} expandableRows pagination /> */}
        <DataTable className="card-stretch">
          
          <DataTableBody>
            <DataTableHead>
              <DataTableRow>
                <span className="sub-text">Company Name</span>
              </DataTableRow>
              <DataTableRow size="mb">
                <span className="sub-text">Contact Person </span>
              </DataTableRow>
              <DataTableRow>
                <span className="sub-text">ISK Info</span>
              </DataTableRow>
              <DataTableRow className="nk-tb-col-tools text-end">
                <span className="sub-text">Action</span>
              </DataTableRow>
            </DataTableHead>
            {/*Head*/}
            {data?.requests?.data != undefined &&
              data?.requests?.data != null &&
              data?.requests?.data.map((item, index) => {
                return (
                  <DataTableItem key={`lenders-invites${item.id}`}>
                    <DataTableRow>
                      <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}>
                        <div className="user-card">
                          <UserAvatar
                            theme={item.avatarBg}
                            text={findUpper(
                              item.consumerName != null && item.consumerName != undefined
                                ? item.consumerName
                                : ""
                            )}
                            image=""
                          ></UserAvatar>
                          <div className="user-info">
                            <span className="tb-lead">
                              {item?.consumerName}{" "}
                              <span
                                className={`dot dot-${
                                  item.approvalStatus === "ACTIVE"
                                    ? "success"
                                    : item?.status === "PENDING"
                                    ? "warning"
                                    : "danger"
                                } d-md-none ms-1`}
                              ></span>
                            </span>
                            <span>{item?.consumerEmail}</span>
                          </div>
                        </div>
                      </Link>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="tb-amount">
                        {item?.consumerContactPersonName} <span className="currency"></span>
                      </span>
                      <span className="tb-amount">
                        {item?.consumerContactPersonPhone} <span className="currency"></span>
                      </span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Type: {item?.consumerType}</span>
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
                                    <li onClick={() => approveFirm(item)}>
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
                                    <li onClick={() => declineFirm(item)}>
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
export default AccesorRequestInvites;