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
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardFooter,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardLink,
} from "reactstrap";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useGetPermissionsListQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../../api/admin/adminActionsApi";
import { Row, Col } from "reactstrap";
import Select from "react-select";

const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const PermissionList = () => {
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
  const [showModalCreatePermission, setShowModalCreatePermission] = useState(false);
  const closeCreateModal = () => {
    resetpermissionForm();
    setEditting(false);
    setEditRecord(null);
    setShowModalCreatePermission(false);
  };
  //   const toggleOpenCompanyDetails = () => setShowModalRoleDetails(!showModalRoleDetails);
  const [searchText, setSearchText] = useState("");
  const [orderColumn, setOrderColumn] = useState("permission_name");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [tableData, setTableData] = useState([]);

  const [editting, setEditting] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const {
    data: allpermissionslist,
    isFetching: fetchingPermissions,
    isLoading: loadingPermissions,
    refetch: refetchPermissions,
    isSuccess: fechingPermissionsSuccessful,
    isError: fetchingPermissionsError,
    error: fetchingPermissionsIsError,
  } = useGetPermissionsListQuery({ currentPage, rowsPerPage, searchText, orderColumn, sortOrder });

  useEffect(() => {
    if (allpermissionslist != null && allpermissionslist.data) {
      setCurrentPage(allpermissionslist?.current_page);
      setTotalRecords(allpermissionslist?.total);
      setTableData(allpermissionslist?.data);
    } else {
      setTableData([{}]);
    }
  }, [allpermissionslist, searchText, refetchPermissions]);

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
    permissionName: yup.string().required("Permission Name is Required"),
    permissionSlug: yup.string().required("Permission Slug is Required"),
  });
  const {
    register: registerPermission,
    control,
    setValue: setPermissionValue,
    reset: resetpermissionForm,
    getValues: getPermissionValues,
    handleSubmit: handleSubmitPermissionForm,
    formState: { errors: createPermissionErrors },
  } = useForm({
    resolver: yupResolver(assignrolepermissionsschema),
  });

  const showCreatePermissionM = (item) => {
    setShowModalCreatePermission(true);
  };

  //form to assin
  const [createPerm, { errors: errorsCreatingPermission }] = useCreatePermissionMutation();
  const [updatePerm, { errors: errorsUpdatingPermission }] = useUpdatePermissionMutation();

  const onSubmitAssignPermissionForm = async (data) => {
    console.log(data);
    let result = null;

    if (editting) {
      result = await updatePerm({ permission_name: data.permissionName, permission: editRecord.id });
    } else {
      result = await createPerm({ permission_name: data.permissionName });
    }

    if ("error" in result) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.error.data.message,
        focusConfirm: false,
      });
    } else {
      resetpermissionForm();
      setEditting(false);
      setEditRecord(null);

      setSearchText(data.permissionName);
      setCurrentPage(1);
      setShowModalCreatePermission(false);
      Swal.fire({
        icon: "success",
        title: "Adding Permission",
        text: result.data.message,
        focusConfirm: false,
      });
    }
  };
  const orderBy = (column) => {
    setOrderColumn(column);
    setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
    refetchPermissions();
  };
  //form to assign
  // edit permission
  const showEditPermission = (item) => {
    setEditting(true);
    setEditRecord(item);
    setPermissionValue("permissionName", item.name);
    setPermissionValue("permissionSlug", item.slug);
    setShowModalCreatePermission(true);
  };

  const [deletePermission, { errors: errorsDeletingPermission }] = useDeletePermissionMutation();
  const fireDeletePermission = (item) => {
    Swal.fire({
      title: "Deleting Permission",
      text: "Are you sure you want to delete " + item.name + " ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes! Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        proceedToDelete(item);
      } else {
      }
    });
  };
  const proceedToDelete = async (data) => {
    const result = deletePermission(data.id);

    console.log(result, "resultresult");
    if ("error" in result) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.error.data.message,
        focusConfirm: false,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Adding Permission",
        text: "Deleted Successfully",
        focusConfirm: false,
      });
      refetchPermissions();
    }
  };
  // edit permission

  return (
    <PreviewCard style={{ height: "100%" }}>
      {/* open modal decline */}
      <Modal size="md" isOpen={showModalCreatePermission}>
        <ModalHeader
          close={
            <button className="close" onClick={closeCreateModal}>
              <Icon name="cross" />
            </button>
          }
        >
          {editting && <span> Edit Permission</span>}
          {!editting && <span> Create Permission</span>}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitPermissionForm(onSubmitAssignPermissionForm)}>
            <Row>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label" htmlFor="first-name">
                    Permission Name
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="permission-name"
                      className="form-control"
                      defaultValue={editting && editRecord != null ? editRecord.name : ""}
                      {...registerPermission("permissionName", { required: true })}
                    />

                    {createPermissionErrors.permissionName && (
                      <span className="invalid">{createPermissionErrors.permissionName?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label" htmlFor="first-name">
                    Permission Slug
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="permission-slug"
                      className="form-control"
                      defaultValue={editting && editRecord != null ? editRecord.slug : ""}
                      {...registerPermission("permissionSlug", { required: true })}
                    />

                    {createPermissionErrors.permissionSlug && (
                      <span className="invalid">{createPermissionErrors.permissionSlug?.message}</span>
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
          </form>
        </ModalBody>
        <ModalFooter className="bg-light"></ModalFooter>
      </Modal>
      {/* close modal for decline */}
      {/* open modal decline */}

      {/* close modal for decline */}
      <BlockHead size="lg" wide="sm">
        <BlockHeadContent>Permission List.</BlockHeadContent>
      </BlockHead>
      {/* <ReactDataTable data={DataTableData} columns={dataTableColumns} expandableRows pagination /> */}
      <Card className="card-bordered" style={{ marginBottom: "15px", marginTop: "15px" }}>
        <CardBody className="card-inner">
          <Row>
            <Col md="8">
              <div id="DataTables_Table_0_filter" className="dataTables_filter">
                <label>
                  <input
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
              </div>
            </Col>
            <Col md="2">
              <div className="datatable-filter">
                <div className="d-flex justify-content-end g-2">
                  <div className="dataTables_length" id="DataTables_Table_0_length">
                    <label>
                      <div className="form-control-select">
                        <select
                          name="DataTables_Table_0_length"
                          className="custom-select custom-select-sm form-control form-control-sm"
                          value={rowsPerPage}
                          onChange={(e) => setRowsPerPage(e.target.value)}
                        >
                          <option value="5">5 Records</option>
                          <option value="10">10 Records</option>
                          <option value="25">25 Records</option>
                          <option value="40">40 Records</option>
                          <option value="50">50 Records</option>
                        </select>{" "}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </Col>
            <Col md="2">
              <Button color="primary" type="submit" style={{ width: "100%" }} onClick={showCreatePermissionM}>
                <Icon name="plus"></Icon> New Permission
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <DataTable
        className="card-stretch "
        sortIcon={
          <div>
            <span>&darr;</span>
            <span>&uarr;</span>
          </div>
        }
      >
        <DataTableBody>
          <DataTableHead>
            <DataTableRow size="md">
              <span
                className="sub-text"
                onClick={() => orderBy("permission_name")}
                style={{ height: "60px", width: "100%", display: "flex", alignItems: "center", cursor: "pointer" }}
              >
                <strong>Permission Name</strong> &nbsp;&nbsp;&nbsp;
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
            currentItems.length > 0 &&
            currentItems.map((item, index) => {
              return (
                <DataTableItem key={index}>
                  <DataTableRow size="sm">{item?.name}</DataTableRow>
                  <DataTableRow size="sm">{item?.slug}</DataTableRow>
                  <DataTableRow size="sm" className="nk-tb-col-tools">
                    <ul className="nk-tb-actions gx-1" style={{ display: "flex", justifyContent: "left" }}>
                      <li>
                        <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                            <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu end>
                            <ul className="link-list-opt no-bdr">
                              <React.Fragment>
                                <li onClick={() => showEditPermission(item)}>
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
                                <li className="divider"></li>
                                <li onClick={() => fireDeletePermission(item)}>
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
                  </DataTableRow>
                </DataTableItem>
              );
            })}
        </DataTableBody>
        <div className="card-inner">
          {currentItems != null && currentItems != undefined ? (
            <PaginationComponent
              itemPerPage={rowsPerPage}
              totalItems={totalRecords}
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
};
export default PermissionList;
