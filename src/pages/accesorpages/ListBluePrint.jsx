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
    Card, CardHeader, CardFooter, CardImg, CardText, CardBody, CardTitle, CardSubtitle, CardLink
} from "reactstrap";

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from "react-toastify";
import { useGetRolesListQuery, useGetPermissionsListQuery } from "../../api/admin/adminActionsApi";
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
    const [showModalRoleDetails, setShowModalRoleDetails] = useState(false);
    const toggleOpenCompanyDetails = () => setShowModalRoleDetails(!showModalRoleDetails);
    const [searchText, setSearchText] = useState("");
    const [orderColumn, setOrderColumn] = useState("permission_name");
    const [sortOrder, setSortOrder] = useState("ASC");
    const [tableData, setTableData] = useState([]);
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
    }
    const declineFirm = (firm) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to decline " + firm?.institution_name + " request",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setActiveRequest(firm?.id)
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
    const assignrolepermissionsschema = yup.object().shape({
        permissions: yup.array().of(yup.object().shape({
            value: yup.string(),
            label: yup.string(),
            name: yup.string()
        })
        ).min(1, "Permission is required required").min(1, "Atleast one recipient is required.")
    });
    const { register: registerRole, control, setValue: setRoleValue, getValues: getRoleValues, handleSubmit: handleSubmitAssignRolePermForm, formState: { errors: assignRoleErrors, isValid: assignRoleErrorsIsValid } } = useForm({
        resolver: yupResolver(assignrolepermissionsschema),
    });

    const showAssignPermissionModal = (item) => {

        let currentpermissions = item.permissions.map(({ id, name }) => ({
            value: id,
            label: name
        }));
        console.log(currentpermissions, "currentpermissions");
        setRoleValue("permissions", currentpermissions);
        setShowModalRoleDetails(true);
    }
    const assignRolePermission = async (row) => {
        const formData = new FormData();
        const result = await archiveRequestt(formData);
        if ('error' in result) {
            if ('backendvalerrors' in result.error.data) {
            }
        } else {
            refetchRoles();
        }
    }
    //form to assin

    const onSubmitAssignRolePermForm = (data) => {
        console.log(data);
    }
    const orderBy = (column) => {
        setOrderColumn(column);
        setSortOrder((sortOrder === "DESC") ? "ASC" : "DESC");
        refetchPermissions();
    }
    //form to assign

    return (
        <PreviewCard style={{ height: "100%" }}>
            {/* open modal decline */}
            <Modal size="md" isOpen={showModalRoleDetails} toggle={toggleOpenCompanyDetails}>
                <form onSubmit={handleSubmitAssignRolePermForm(onSubmitAssignRolePermForm)}>
                    <ModalHeader
                        toggle={toggleOpenCompanyDetails}
                        close={
                            <button className="close" onClick={toggleOpenCompanyDetails}>
                                <Icon name="cross" />
                            </button>
                        }
                    >
                        Permission Details
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="6">
                            </Col>
                            <Col md="6">
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
                                        onChange={(ev) => {
                                            setCurrentPage(1);
                                            setSearchText(ev.target.value)
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
                            <Button color="primary" type="submit" style={{ width: "100%" }}>
                                <Icon name="plus"></Icon>  New Permission
                            </Button>
                        </Col>

                    </Row>

                </CardBody>
            </Card>




            <DataTable className="card-stretch "
                sortIcon={
                    <div>
                        <span>&darr;</span>
                        <span>&uarr;</span>
                    </div>
                }

            >
                <DataTableBody>
                    <DataTableHead  >
                        <DataTableRow size="md" >
                            <span className="sub-text" onClick={() => orderBy("permission_name")} style={{ height: "60px", width: "100%", display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <strong>Permission Name</strong> &nbsp;&nbsp;&nbsp;
                                <Icon name="sort-fill" />
                            </span>
                        </DataTableRow>
                        <DataTableRow size="md">
                            <span className="sub-text" style={{ height: "60px", width: "100%", display: "flex", alignItems: "center" }}>Slug</span>
                        </DataTableRow>
                        <DataTableRow size="md" className="nk-tb-col-tools text-end">
                            <span className="sub-text" style={{ height: "60px", width: "100%", display: "flex", alignItems: "center" }}>Actions</span>
                        </DataTableRow>
                    </DataTableHead>
                    {/*Head*/}
                    {currentItems != undefined &&
                        currentItems != null &&
                        currentItems.length > 0 &&
                        currentItems.map((item, index) => {
                            return (
                                <DataTableItem key={index}>
                                    <DataTableRow size="sm">
                                        {item?.name}
                                    </DataTableRow>
                                    <DataTableRow size="sm">
                                        {item?.slug}
                                    </DataTableRow>
                                    <DataTableRow size="sm" className="nk-tb-col-tools" >
                                        <ul className="nk-tb-actions gx-1" style={{ display: "flex", justifyContent: "left" }}>
                                            <li>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                                        <Icon name="more-h"></Icon>
                                                    </DropdownToggle>
                                                    <DropdownMenu end>
                                                        <ul className="link-list-opt no-bdr">
                                                            <React.Fragment>
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
                                                        </ul>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </li>
                                        </ul>
                                    </DataTableRow>
                                </DataTableItem>
                            );
                        })
                    }
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


        </PreviewCard >
    );

};
export default PermissionList;
