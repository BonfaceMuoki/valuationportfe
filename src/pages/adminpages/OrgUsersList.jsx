import React, { useState, useEffect } from "react";
import { BlockHead, BlockHeadContent, PreviewCard, Icon, UserAvatar } from "../../components/Component";
import DataTable from "react-data-table-component";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useGetRolesListQuery } from "../../api/admin/adminActionsApi";
import { Row, Col } from "reactstrap";
import Select from "react-select";
import { useGetUsersQuery, useSendValuationFirmUserInviteMutation } from "../../api/commonEndPointsAPI";
import { findUpper } from "../../utils/Utils";
import { selectCurrentSelectedOrg } from "../../featuers/authSlice";

import { DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { useSelector } from "react-redux";
import { useGetOrgUsersQuery } from "../../api/admin/adminActionsApi";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const OrgUsersList = ({ orgnization, orgtype }) => {
  const [theOrg, settheOrg] = useState(useSelector(selectCurrentSelectedOrg));
  const [organizationtype, setOrganizationType] = useState(theOrg?.org_type);
  const [organization, setOrganization] = useState(theOrg?.id);
  console.log(theOrg, "theOrg");
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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
  const handleCloseUserDetailsModal = () => {
    setOpenUserDetailsModal(false);
  };
  const handleOpenUserDetailsModal = () => {
    setOpenUserDetailsModal(true);
  };
  const [searchText, setSearchText] = useState("");
  const [orderColumn, setOrderColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [tableData, setTableData] = useState([]);

  const [editting, setEditting] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const {
    data: alluserslist,
    isFetching: fetchingUsers,
    isLoading: loadingUsers,
    refetch: refetchUsers,
    isSuccess,
    isError,
    error,
  } = useGetOrgUsersQuery({
    currentPage,
    rowsPerPage,
    searchText,
    orderColumn,
    sortOrder,
    organization,
    organizationtype,
  });
  // console.log(alluserslist, "alluserslist");
  useEffect(() => {
    if (alluserslist != null && alluserslist.data) {
      setCurrentPage(alluserslist?.current_page);
      setTotalRecords(alluserslist?.total);
      setTableData(alluserslist?.data);
    } else {
      setTableData([{}]);
    }
  }, [alluserslist, searchText, refetchUsers]);

  useEffect(() => {
    if (tableData != null) {
      setCurrentItems(tableData);
    }
  }, [tableData]);
  // const currentItems = ;
  const frontendbaseurl = process.env.REACT_APP_FRONTEND_BASE_URL;
  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  ///intialize invite form
  const inviteformschema = yup.object().shape({
    full_names: yup.string().required("Full name is required"),
    login_email: yup.string().required("Login Email is required"),
    phone_number: yup.string().required("Contact Phone number is required"),
    // isk_number: yup.string().required("ISK number is required"),
    // vrb_number: yup.string().required("VRB number is required")
  });
  const {
    register: registerInvitForm,
    handleSubmit: handleInviteFormsubmit,
    reset: resetValuerInviteForm,
    formState: { errors: inviteFormErrors },
    control,
  } = useForm({
    resolver: yupResolver(inviteformschema),
  });
  const [inviteUploaderuser, { isLoading: sendingUploaderInvite }] = useSendValuationFirmUserInviteMutation();
  const onSubmitInviteFormsubmit = async (data) => {
    console.log(data.invite_as, "datadata");
    const formdata = new FormData();
    formdata.append("name", data.full_names);
    formdata.append("vrb_number", data.vrb_number);
    formdata.append("isk_number", data.isk_number);
    formdata.append("phone", data.phone_number);
    formdata.append("email", data.login_email);
    formdata.append("invited_as", data.invite_as.value);
    formdata.append("login_url", `${process.env.REACT_APP_FRONTEND_BASE_URL}/complete-valuer-user-registration-login`);
    formdata.append(
      "registration_url",
      `${process.env.REACT_APP_FRONTEND_BASE_URL}/complete-valuer-user-registration-register`
    );
    const result = await inviteUploaderuser(formdata);
    if ("error" in result) {
      toastMessage(result.error.data.message, "error");
      if ("backendvalerrors" in result.error.data) {
        // setBackendValErrors(result.error.data.backendvalerrors);
        resetValuerInviteForm();
        // setBlocked(false);
      }
    } else {
      toastMessage(result.data.message, "success");
      //   setBlocked(false);
    }
  };
  const getOptionLabel = (option) => {
    if (!option) {
      return ""; // Return an empty string for undefined or null options
    }
    // Handle other cases based on your data structure
    return option.name ? option.name : ""; // Assuming each option has a 'label' property
  };
  ///intialize invite form

  const { data: roles, isFetching, isLoading, refetch: refetchRoles } = useGetRolesListQuery();
  // console.log(roles);
  const [allRolesList, setAllRolesList] = useState();
  useEffect(() => {
    if (roles != undefined) {
      const restructuredData = roles?.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      setAllRolesList(restructuredData);
    }
  }, [roles]);

  console.log(allRolesList, "rolesrolesroles");

  const [mobileView, setMobileView] = useState();

  const viewChange = () => {
    if (window.innerWidth < 960) {
      console.log(window.innerWidth);
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  };
  useEffect(() => {
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    return () => {
      window.removeEventListener("resize", viewChange);
    };
  }, []);

  const CustomTitle = ({ row }) => (
    <div className="user-card">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <UserAvatar
          theme={row?.avatarBg}
          text={findUpper(row.full_name != null && row.full_name != undefined ? row.full_name : "")}
          image=""
        ></UserAvatar>{" "}
        <p>{row.full_name}</p>
      </div>
    </div>
  );

  const ManageUsers = ({ row }) => (
    <div className="user-card">
      {" "}
      <ul className="nk-tb-actions gx-1" style={{ display: "flex", justifyContent: "left" }}>
        <li>
          <UncontrolledDropdown>
            <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
              <Icon name="more-h"></Icon>
            </DropdownToggle>
            <DropdownMenu end>
              <ul className="link-list-opt no-bdr">
                <React.Fragment>
                  <li className="divider"></li>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#suspend"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      <Icon name="trash"></Icon>
                      <span>Delete</span>
                    </DropdownItem>
                  </li>
                </React.Fragment>
              </ul>
            </DropdownMenu>
          </UncontrolledDropdown>
        </li>
      </ul>
    </div>
  );

  const [columns, setColumns] = useState([
    {
      name: "Full Name",
      selector: (row) => row.full_name,
      sortable: true,
      cell: (row) => <CustomTitle row={row} />,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      hide: 370,
    },
    {
      name: "Phone",
      selector: (row) => row.phone_number,
      sortable: true,
      hide: "sm",
    },
    {
      name: "VRB Number",
      selector: (row) => row.vrb_number,
      sortable: true,
      hide: "sm",
    },
    {
      name: "ISK Number ",
      selector: (row) => row.isk_number,
      sortable: true,
      hide: "md",
    },
    {
      name: "Actions",
      selector: (row) => row.isk_number,
      sortable: true,
      hide: "md",
      cell: (row) => <ManageUsers row={row} />,
    },
  ]);

  const ExpandableRowComponent = ({ data }) => {
    return (
      <ul className="dtr-details p-2 border-bottom ms-1">
        <li className="d-block d-sm-none">
          <span className="dtr-title">Phone</span> <span className="dtr-data">{data?.forced_market_value}</span>
        </li>
        <li className="d-block d-sm-none">
          <span className="dtr-title ">VRB Number</span> <span className="dtr-data">{data.market_value}</span>
        </li>
        <li>
          <span className="dtr-title">ISK Number</span> <span className="dtr-data">{data.created_at}</span>
        </li>
        <li>
          <span className="dtr-title">DownLoad</span>{" "}
          <span className="dtr-data">
            <ManageUsers row={data} />
          </span>
        </li>
      </ul>
    );
  };

  return (
    <PreviewCard style={{ height: "100%" }}>
      {/* open modal decline */}
      <Modal size="md" isOpen={openUserDetailsModal}>
        <ModalHeader
          close={
            <button className="close" onClick={handleCloseUserDetailsModal}>
              <Icon name="cross" />
            </button>
          }
        >
          {editting && <span> Edit User</span>}
          {!editting && <span> Invite User</span>}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleInviteFormsubmit(onSubmitInviteFormsubmit)}>
            <Row>
              <Col md="12">
                <div className="form-group">
                  <label className="form-label" htmlFor="fw-token-address">
                    Invite As
                  </label>
                  <div className="form-control-wrap">
                    {roles && roles.length > 0 && (
                      <Controller
                        name="invite_as"
                        control={control}
                        render={({ field }) => (
                          <Select options={allRolesList} isSearchable={true} isClearable={true} {...field} />
                        )}
                      />
                    )}
                    {inviteFormErrors.invite_as?.message}
                    {inviteFormErrors.invite_as && (
                      <span className="invalid">{inviteFormErrors.invite_as?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Full Names
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...registerInvitForm("full_names", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your Full Names"
                  className="form-control-lg form-control"
                />
                {inviteFormErrors.full_names?.message && (
                  <span className="invalid">{inviteFormErrors.full_names?.message}</span>
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
                  {...registerInvitForm("login_email", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your email address"
                  className="form-control-lg form-control"
                />
                {inviteFormErrors.login_email?.message && (
                  <span className="invalid">{inviteFormErrors.login_email?.message}</span>
                )}
              </div>
            </div>
            {/* <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="default-01">
                                    Company Name
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="default-01"
                                    {...registerInvitForm("company_name", { required: "This field is required" })}
                                    defaultValue=""
                                    placeholder="Enter your Company Name"
                                    className="form-control-lg form-control"
                                />
                                {inviteFormErrors.company_name?.message && (
                                    <span className="invalid">{inviteFormErrors.company_name?.message}</span>
                                )}
                            </div>
                        </div> */}

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
                      id="default-01"
                      {...registerInvitForm("vrb_number", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter VRB number"
                      className="form-control-lg form-control"
                    />
                    {inviteFormErrors.directors_vrb_numer?.message && (
                      <span className="invalid">{inviteFormErrors.vrb_number?.message}</span>
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
                      id="default-01"
                      {...registerInvitForm("isk_number", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter ISK Number"
                      className="form-control-lg form-control"
                    />
                    {inviteFormErrors.directors_isk_numer?.message && (
                      <span className="invalid">{inviteFormErrors.isk_number?.message}</span>
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
                  id="default-01"
                  {...registerInvitForm("phone_number", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your email address"
                  className="form-control-lg form-control"
                />
                {inviteFormErrors.phone_number?.message && (
                  <span className="invalid">{inviteFormErrors.phone_number?.message}</span>
                )}
              </div>
            </div>
            <div className="form-group">
              <Button size="lg" className="btn-block" type="submit" color="primary">
                Submit
              </Button>
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-light"></ModalFooter>
      </Modal>
      {/* close modal for decline */}
      {/* open modal decline */}

      {/* close modal for decline */}
      <BlockHead size="lg" wide="sm">
        <BlockHeadContent>Users List.</BlockHeadContent>
      </BlockHead>
      {/* <ReactDataTable data={DataTableData} columns={dataTableColumns} expandableRows pagination /> */}
      <Card
        className="card-bordered"
        style={{ marginBottom: "15px", marginTop: "15px", backgroundColor: "#F2F3F5", borderRadius: "25px" }}
      >
        <CardHeader style={{ borderTopLeftRadius: "25px", borderTopRightRadius: "25px" }}>
          <Row>
            <Col md="8" sm="12">
              <h5>
                {" "}
                <em> {theOrg?.organization_name} </em> Users List{" "}
              </h5>
            </Col>
          </Row>
        </CardHeader>
        <CardBody className="card-inner">
          <Row>
            <Col md="8" sm="12">
              {/* <div id="DataTables_Table_0_filter" className="dataTables_filter" style={{ width: "100%" }}> */}
              <label style={{ width: "100%", marginTop: "10px" }}>
                <input
                  style={{ width: "100%" }}
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search by name"
                  value={searchText}
                  onChange={(ev) => {
                    setCurrentPage(1);
                    setSearchText(ev.target.value);
                  }}
                />
              </label>
              {/* </div> */}
            </Col>
            <Col md="2" sm="12">
              {/* <div className="datatable-filter" style={{ width: "100%"}}>
                                <div className="d-flex justify-content-end g-2">

                                    <div className="dataTables_length" id="DataTables_Table_0_length">
                                        <label>

                                            <div className="form-control-select"> */}
              <select
                style={{ width: "100%", marginTop: "10px" }}
                name="DataTables_Table_0_length"
                className="custom-select custom-select-sm form-control form-control-sm"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value)}
              >
                <option value="5">Showing 5 Records</option>
                <option value="10">Showing 10 Records</option>
                <option value="25">Showing 25 Records</option>
                <option value="40">Showing 40 Records</option>
                <option value="50">Showing 50 Records</option>
              </select>{" "}
              {/* </div>
                                        </label>
                                    </div>
                                </div>
                            </div> */}
            </Col>
            <Col md="2" style={{ display: "flex", justifyContent: "flex-end" }} sm="12">
              <Button
                color="primary"
                className="btn-round"
                size="sm"
                type="submit"
                onClick={handleOpenUserDetailsModal}
                style={{ width: "100%", marginTop: "10px" }}
              >
                <Icon name="plus"></Icon>&nbsp;&nbsp; New User
              </Button>
            </Col>
          </Row>
          <DataTable
            data={currentItems}
            columns={columns}
            className="nk-tb-list"
            expandableRowsComponent={ExpandableRowComponent}
            expandableRows={mobileView}
            noDataComponent={<div className="p-2">There are no records found</div>}
            sortIcon={
              <div>
                <span>&darr;</span>
                <span>&uarr;</span>
              </div>
            }
          ></DataTable>
        </CardBody>
      </Card>
    </PreviewCard>
  );
};
export default OrgUsersList;
