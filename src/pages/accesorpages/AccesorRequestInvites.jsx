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
  const [tableData, setTableData] = useState([]);

  const {
    data: firms,
    isFetching,
    isLoading,
    refetch: refetchFirmRequests,
    isSuccess,
    isError,
    error,
  } = useGetAccesorRequestsQuery();
  const [acceptAccesorAccessRequest, { isLoading: sendingUploaderInvite }] = useApproveAccesorRequestMutation();
  const [rejectValuationFirmRequest, { isloading: sendingReject }] = useRejectAccesorRequestMutation();

  console.log(firms);

  useEffect(() => {
    if (firms != null) {
      setTableData(firms);
    } else {
      setTableData([{}]);
    }
  }, [firms]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  useEffect(() => {
    if (tableData != null) {
      const indexOfLastItem = currentPage * itemPerPage;
      const indexOfFirstItem = indexOfLastItem - itemPerPage;
      setcurrentItems(tableData?.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [tableData]);

  // const currentItems = ;
  const frontendbaseurl = process.env.REACT_APP_FRONTEND_BASE_URL;

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
    const formData = new FormData();
    formData.append("request_id", data?.id);
    formData.append("login_url", `${frontendbaseurl}/complete-accesor-invite-by-login`);
    formData.append("registration_url", `${frontendbaseurl}/complete-accesor-invite-by-registering`);
    const result = await acceptAccesorAccessRequest(formData);
    if ("error" in result) {
      Swal.fire("Approved!", result.error.data.message, "success");
      if ("backendvalerrors" in result.error.data) {
      }
    } else {
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
  if (tableData.length > 0) {
    console.log("Table Data");
    console.log(tableData);
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
          {/* <div className="card-inner position-relative card-tools-toggle">
          <div className="card-title-group">
            <div className="card-tools">
              <div className="form-inline flex-nowrap gx-3">
                <div className="form-wrap">
                  <RSelect
                    options={bulkActionOptions}
                    className="w-130px"
                    placeholder="Bulk Action"
                    onChange={(e) => onActionText(e)}
                  />
                </div>
                <div className="btn-wrap">
                  <span className="d-none d-md-block">
                    <Button
                      disabled={actionText !== "" ? false : true}
                      color="light"
                      outline
                      className="btn-dim"
                      onClick={(e) => onActionClick(e)}
                    >
                      Apply
                    </Button>
                  </span>
                  <span className="d-md-none">
                    <Button
                      color="light"
                      outline
                      disabled={actionText !== "" ? false : true}
                      className="btn-dim btn-icon"
                      onClick={(e) => onActionClick(e)}
                    >
                      <Icon name="arrow-right"></Icon>
                    </Button>
                  </span>
                </div>
              </div>
            </div>
            <div className="card-tools me-n1">
              <ul className="btn-toolbar gx-1">
                <li>
                  <a
                    href="#search"
                    onClick={(ev) => {
                      ev.preventDefault();
                      toggle();
                    }}
                    className="btn btn-icon search-toggle toggle-search"
                  >
                    <Icon name="search"></Icon>
                  </a>
                </li>
                <li className="btn-toolbar-sep"></li>
                <li>
                  <div className="toggle-wrap">
                    <Button
                      className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                      onClick={() => updateTableSm(true)}
                    >
                      <Icon name="menu-right"></Icon>
                    </Button>
                    <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                      <ul className="btn-toolbar gx-1">
                        <li className="toggle-close">
                          <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                            <Icon name="arrow-left"></Icon>
                          </Button>
                        </li>
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                              <div className="dot dot-primary"></div>
                              <Icon name="filter-alt"></Icon>
                            </DropdownToggle>
                            <DropdownMenu
                              end
                              className="filter-wg dropdown-menu-xl"
                              style={{ overflow: "visible" }}
                            >
                              <div className="dropdown-head">
                                <span className="sub-title dropdown-title">Filter Users</span>
                                <div className="dropdown">
                                  <a
                                    href="#more"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                    className="btn btn-sm btn-icon"
                                  >
                                    <Icon name="more-h"></Icon>
                                  </a>
                                </div>
                              </div>
                              <div className="dropdown-body dropdown-body-rg">
                                <Row className="gx-6 gy-3">
                                  <Col size="6">
                                    <div className="custom-control custom-control-sm custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="hasBalance"
                                      />
                                      <label className="custom-control-label" htmlFor="hasBalance">
                                        {" "}
                                        Have Balance
                                      </label>
                                    </div>
                                  </Col>
                                  <Col size="6">
                                    <div className="custom-control custom-control-sm custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="hasKYC"
                                      />
                                      <label className="custom-control-label" htmlFor="hasKYC">
                                        {" "}
                                        KYC Verified
                                      </label>
                                    </div>
                                  </Col>
                                  <Col size="6">
                                    <div className="form-group">
                                      <label className="overline-title overline-title-alt">Role</label>
                                      <RSelect options={filterRole} placeholder="Any Role" />
                                    </div>
                                  </Col>
                                  <Col size="6">
                                    <div className="form-group">
                                      <label className="overline-title overline-title-alt">Status</label>
                                      <RSelect options={filterStatus} placeholder="Any Status" />
                                    </div>
                                  </Col>
                                  <Col size="12">
                                    <div className="form-group">
                                      <button type="button" className="btn btn-secondary">
                                        Filter
                                      </button>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                              <div className="dropdown-foot between">
                                <a
                                  href="#reset"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                  className="clickable"
                                >
                                  Reset Filter
                                </a>
                                <a
                                  href="#save"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  Save Filter
                                </a>
                              </div>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle color="tranparent" className="btn btn-trigger btn-icon dropdown-toggle">
                              <Icon name="setting"></Icon>
                            </DropdownToggle>
                            <DropdownMenu end className="dropdown-menu-xs">
                              <ul className="link-check">
                                <li>
                                  <span>Show</span>
                                </li>
                                <li className={itemPerPage === 10 ? "active" : ""}>
                                  <DropdownItem
                                    tag="a"
                                    href="#dropdownitem"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      setItemPerPage(10);
                                    }}
                                  >
                                    10
                                  </DropdownItem>
                                </li>
                                <li className={itemPerPage === 15 ? "active" : ""}>
                                  <DropdownItem
                                    tag="a"
                                    href="#dropdownitem"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      setItemPerPage(15);
                                    }}
                                  >
                                    15
                                  </DropdownItem>
                                </li>
                              </ul>
                              <ul className="link-check">
                                <li>
                                  <span>Order</span>
                                </li>
                                <li className={sort === "dsc" ? "active" : ""}>
                                  <DropdownItem
                                    tag="a"
                                    href="#dropdownitem"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      setSortState("dsc");
                                      sortFunc("dsc");
                                    }}
                                  >
                                    DESC
                                  </DropdownItem>
                                </li>
                                <li className={sort === "asc" ? "active" : ""}>
                                  <DropdownItem
                                    tag="a"
                                    href="#dropdownitem"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      setSortState("asc");
                                      sortFunc("asc");
                                    }}
                                  >
                                    ASC
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className={`card-search search-wrap ${!onSearch && "active"}`}>
            <div className="card-body">
              <div className="search-content">
                <Button
                  className="search-back btn-icon toggle-search active"
                  onClick={() => {
                    setSearchText("");
                    toggle();
                  }}
                >
                  <Icon name="arrow-left"></Icon>
                </Button>
                <input
                  type="text"
                  className="border-transparent form-focus-none form-control"
                  placeholder="Search by user or email"
                  value={onSearchText}
                  onChange={(e) => onFilterChange(e)}
                />
                <Button className="search-submit btn-icon">
                  <Icon name="search"></Icon>
                </Button>
              </div>
            </div>
          </div>
        </div>
         */}
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
            {currentItems != undefined &&
              currentItems != null &&
              currentItems.map((item, index) => {
                return (
                  <DataTableItem key={`accesor-request-${item.id}`}> 
                    <DataTableRow>
                      <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}>
                        <div className="user-card">
                          <UserAvatar
                            theme={item.avatarBg}
                            text={findUpper(
                              item.institution_name != null && item.institution_name != undefined
                                ? item.institution_name
                                : ""
                            )}
                            image=""
                          ></UserAvatar>
                          <div className="user-info">
                            <span className="tb-lead">
                              {item?.institution_name}{" "}
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
                            <span>{item?.invite_email}</span>
                          </div>
                        </div>
                      </Link>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="tb-amount">
                        {item?.contact_person_name} <span className="currency"></span>
                      </span>
                      <span className="tb-amount">
                        {item?.contact_person_phone} <span className="currency"></span>
                      </span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Type: {item?.type}</span>
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
                                {item?.status === "Requested" && (
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
            {currentItems != null && currentItems != undefined ? (
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={tableData?.length}
                paginate={paginate}
                currentPage={currentPage}
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
