import React, { useState, useEffect } from "react";
import {
  BlockHead,
  BlockHeadContent,
  PreviewCard,
  Icon,
  UserAvatar,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
} from "../../components/Component";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useGetRolesListQuery,
  useGetPermissionsListQuery,
  useUpdateRolePermissionMutation,
} from "../../api/admin/adminActionsApi";
import { findUpper } from "../../utils/Utils";
import { Row, Col } from "reactstrap";
import Select from "react-select";

const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const RoleList = () => {
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
  const [showRegisterPermissionModal, setShowRegisterPermissionModal] = useState(false);
  const toggleOpenCompanyDetails = () => {
    setShowRegisterPermissionModal(false);
  };
  const [currentItems, setcurrentItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const {
    data: roles,
    isFetching,
    isLoading,
    refetch: refetchRoles,
    isSuccess,
    isError,
    error,
  } = useGetRolesListQuery();
  const {
    data: allpermissionslist,
    isFetching: fetchingPermissions,
    isLoading: loadingPermissions,
    refetch: refetchPermissions,
    isSuccess: fechingPermissionsSuccessful,
    isError: fetchingPermissionsError,
    error: fetchingPermissionsIsError,
  } = useGetPermissionsListQuery({
    currentPage: 1,
    rowsPerPage: "all",
    searchText: "",
    orderColumn: "permission_name",
    sortOrder: "ASC",
  });
  const [allPermissions, setAllPermissions] = useState();

  const [allRolePermissions, setAllRolePermissions] = useState();
  useEffect(() => {
    if (allpermissionslist != undefined) {
      const restructuredData = allpermissionslist?.data?.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      setAllPermissions(restructuredData);
    }
  }, [allpermissionslist]);
  useEffect(() => {
    if (roles != null) {
      setTableData(roles);
    } else {
      setTableData([{}]);
    }
  }, [roles]);
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
  const declineFirm = (firm) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to decline " + firm?.institution_name + " request",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // setActiveRequest(firm?.id)
        // setModalSm(true);
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
  const assignrolepermissionsschema = yup.object().shape({
    permissions: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string(),
          label: yup.string(),
          name: yup.string(),
        })
      )
      .min(1, "Permission is required required")
      .min(1, "Atleast one recipient is required."),
  });
  const {
    register: registerRole,
    control,
    setValue: setRoleValue,
    getValues: getRoleValues,
    handleSubmit: handleSubmitAssignRolePermForm,
    formState: { errors: assignRoleErrors, isValid: assignRoleErrorsIsValid },
  } = useForm({
    resolver: yupResolver(assignrolepermissionsschema),
  });

  const [activeRole, setActiveRole] = useState();

  const showAssignPermissionModal = (item) => {
    setActiveRole(item.id);
    let currentpermissions = item.permissions.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
    console.log(currentpermissions, "currentpermissions");

    setRoleValue("permissions", currentpermissions);
    setRoleValue("roleName", item.name);
    setRoleValue("roleSlug", item.slug);

    setShowRegisterPermissionModal(true);
  };
  const assignRolePermission = async (row) => {
    const formData = new FormData();
    // const result = await archiveRequestt(formData);
    // if ("error" in result) {
    //   if ("backendvalerrors" in result.error.data) {
    //   }
    // } else {
    //   Swal.fire({
    //     icon: "success",
    //     title: "Update Role Permission",
    //     text: result.data.message,
    //     focusConfirm: false,
    //   });
    //   refetchRoles();
    // }
  };
  //form to assin
  const [updateRolePermission, { errors: errorsUpdatingRolePermission }] = useUpdateRolePermissionMutation();
  const onSubmitAssignRolePermForm = async (data) => {
    console.log(data);
    let permissions = data.permissions.map((item, index) => {
      return parseInt(item.value);
    });
    const result = await updateRolePermission({ role: activeRole, permmissions: permissions });
    console.log(result, "resultresult");
    if ("error" in result) {
      if ("backendvalerrors" in result.error.data) {
      }
    } else {
      Swal.fire({
        icon: "success",
        title: "Update Role Permission",
        text: result.data.message,
        focusConfirm: false,
      });
      refetchRoles();
    }
  };
  //form to assign
  if (tableData.length > 0) {
    console.log("Table Data");
    console.log(tableData);
    return (
      <PreviewCard style={{ height: "100%" }}>
        {/* open modal decline */}
        <Modal size="md" isOpen={showRegisterPermissionModal}>
          <form onSubmit={handleSubmitAssignRolePermForm(onSubmitAssignRolePermForm)}>
            <ModalHeader
              close={
                <button className="close" onClick={toggleOpenCompanyDetails}>
                  <Icon name="cross" />
                </button>
              }
            >
              Role Details
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="first-name">
                      Role Name
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="role-name"
                        className="form-control"
                        disabled
                        {...registerRole("roleName", { required: true })}
                      />
                      {assignRoleErrors?.roleName?.message}
                      {assignRoleErrors.roleName && (
                        <span className="invalid">{assignRoleErrors.roleName?.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="first-name">
                      Role Slug
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="role-slug"
                        className="form-control"
                        disabled
                        {...registerRole("roleSlug", { required: true })}
                      />
                      {assignRoleErrors?.roleSlug?.message}
                      {assignRoleErrors.roleSlug && (
                        <span className="invalid">{assignRoleErrors.roleSlug?.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fw-token-address">
                      Permissions
                    </label>
                    <div className="form-control-wrap">
                      {allPermissions && allPermissions.length > 0 && (
                        <Controller
                          name="permissions"
                          control={control}
                          render={({ field }) => (
                            <Select
                              isMulti
                              options={allPermissions}
                              isSearchable={true}
                              isClearable={true}
                              {...field}
                            />
                          )}
                        />
                      )}
                      {assignRoleErrors.permissions?.message}
                      {assignRoleErrors.permissions && (
                        <span className="invalid">{assignRoleErrors.permissions?.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={{ marginTop: "10px" }}>
                <Col md="12">
                  <Button
                    color="primary"
                    type="submit"
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter className="bg-light"></ModalFooter>
          </form>
        </Modal>
        {/* close modal for decline */}
        {/* open modal decline */}

        {/* close modal for decline */}
        <BlockHead size="lg" wide="sm">
          <BlockHeadContent>Accesors Access Requests.</BlockHeadContent>
        </BlockHead>
        {/* <ReactDataTable data={DataTableData} columns={dataTableColumns} expandableRows pagination /> onClick={() => orderBy("role_name")} */}
        <DataTable className="card-stretch">
          <DataTableBody>
            <DataTableHead>
              <DataTableRow size="md">
                <span
                  className="sub-text"
                  style={{ height: "60px", width: "100%", display: "flex", alignItems: "center", cursor: "pointer" }}
                >
                  <strong>Role Name</strong> &nbsp;&nbsp;&nbsp;
                  <Icon name="sort-fill" />
                </span>
              </DataTableRow>
              <DataTableRow size="md">
                <span
                  className="sub-text"
                  style={{ height: "60px", width: "100%", display: "flex", alignItems: "center" }}
                >
                  Slug
                </span>
              </DataTableRow>
              <DataTableRow size="md" className="nk-tb-col-tools text-end">
                <span
                  className="sub-text"
                  style={{ height: "60px", width: "100%", display: "flex", alignItems: "center" }}
                >
                  Actions
                </span>
              </DataTableRow>
            </DataTableHead>
            {/*Head*/}
            {currentItems != undefined &&
              currentItems != null &&
              currentItems.map((item, index) => {
                return (
                  <DataTableItem key={index}>
                    <DataTableRow>{item?.name}</DataTableRow>
                    <DataTableRow size="md">{item?.slug}</DataTableRow>
                    <DataTableRow className="nk-tb-col-tools">
                      <ul className="nk-tb-actions gx-1" style={{ display: "flex", justifyContent: "left" }}>
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                              <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu end>
                              <ul className="link-list-opt no-bdr">
                                <React.Fragment>
                                  <li onClick={() => showAssignPermissionModal(item)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="unlock"></Icon>
                                      <span>Assign Permission</span>
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
                                      <Icon name="edit"></Icon>
                                      <span>Edit</span>
                                    </DropdownItem>
                                  </li>
                                </React.Fragment>
                                <li className="divider"></li>
                                <React.Fragment>
                                  {/* <li onClick={() => viewRegistrationStatus(item)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="eye"></Icon>
                                      <span>View</span>
                                    </DropdownItem>
                                  </li> */}
                                </React.Fragment>
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
export default RoleList;
