import React, { useState, useEffect } from "react";
import {
  BlockHead,
  BlockHeadContent,
  PreviewCard,
  Icon,
  UserAvatar,
} from "../../components/Component";
import DataTable from "react-data-table-component";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Row,
  Col,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useGetRolesListQuery,
} from "../../api/admin/adminActionsApi";
import Select from "react-select";
import { useSendValuationFirmUserInviteMutation, useGetValuersListQuery } from "../../api/commonEndPointsAPI";
import { findUpper } from "../../utils/Utils";

const CloseButton = () => (
  <span className="btn-trigger toast-close-button" role="button">
    <Icon name="cross" />
  </span>
);

const ValuationFirms = () => {
  const toastMessage = (message, type) => {
    toast[type](message, {
      position: "top-right",
      autoClose: true,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: false,
      closeButton: <CloseButton />,
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [tableData, setTableData] = useState([]);
  const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    const handleViewChange = () => setMobileView(window.innerWidth < 960);
    handleViewChange();
    window.addEventListener("resize", handleViewChange);
    return () => window.removeEventListener("resize", handleViewChange);
  }, []);
console.log(currentPage, rowsPerPage, searchText)
  const { data: alluserslist, isLoading } = useGetValuersListQuery({
    currentPage,
    rowsPerPage: rowsPerPage,
    searchText,
    orderColumn: "created_at",
    sortOrder: "desc",
  });

  useEffect(() => {
    setTableData(alluserslist?.firms?.data || []);
    if (alluserslist && currentPage > alluserslist.firms?.last_page) {
      setCurrentPage(1);
    }
  }, [alluserslist]);

  const { data: roles } = useGetRolesListQuery();
  const [allRolesList, setAllRolesList] = useState([]);

  useEffect(() => {
    if (roles) {
      setAllRolesList(roles.map(({ id, name }) => ({ value: id, label: name })));
    }
  }, [roles]);

  const inviteSchema = yup.object().shape({
    full_names: yup.string().required("Full name is required"),
    login_email: yup.string().email().required("Login Email is required"),
    phone_number: yup.string().required("Phone number is required"),
    invite_as: yup.object().nullable().required("Role is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(inviteSchema) });

  const [sendInvite, { isLoading: sendingInvite }] = useSendValuationFirmUserInviteMutation();

  const onSubmitInvite = async (data) => {
    const formdata = new FormData();
    formdata.append("name", data.full_names);
    formdata.append("vrb_number", data.vrb_number || "");
    formdata.append("isk_number", data.isk_number || "");
    formdata.append("phone", data.phone_number);
    formdata.append("email", data.login_email);
    formdata.append("invited_as", data.invite_as.value);
    formdata.append("login_url", `${process.env.REACT_APP_FRONTEND_BASE_URL}/complete-valuer-user-registration-login`);
    formdata.append("registration_url", `${process.env.REACT_APP_FRONTEND_BASE_URL}/complete-valuer-user-registration-register`);

    const result = await sendInvite(formdata);
    if (result.error) {
      toastMessage(result.error.data.message || "Error sending invite", "error");
    } else {
      toastMessage(result.data.message || "Invite sent successfully", "success");
      reset();
      setOpenUserDetailsModal(false);
    }
  };

  const ExpandableRowComponent = ({ data }) => (
    <ul className="dtr-details p-2 border-bottom ms-1" style={{ listStyleType: "none" }}>
      <li><strong>Email:</strong> {data.valuationFirmEmail || "-"}</li>
      <li><strong>Phone:</strong> {data.companyPhone || "-"}</li>
      <li><strong>VRB Number:</strong> {data.vrbNumber || "-"}</li>
      <li><strong>ISK Number:</strong> {data.iskNumber || "-"}</li>
    </ul>
  );

  const columns = [
    {
      name: "Organization Name",
      selector: (row) => row.valuationFirmName,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <UserAvatar text={findUpper(row.valuationFirmName || "")} />
          <span>{row.valuationFirmName}</span>
        </div>
      ),
    },
    { name: "Email", selector: (row) => row.valuationFirmEmail },
    { name: "Phone", selector: (row) => row.companyPhone },
    { name: "VRB Number", selector: (row) => row.vrbNumber },
    { name: "ISK Number", selector: (row) => row.iskNumber },
    {
      name: "Actions",
      cell: (row) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
            <Icon name="more-h" />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem onClick={() => alert(`Block ${row.valuationFirmName}`)}>
              <Icon name="lock" /> Block
            </DropdownItem>
            <DropdownItem onClick={() => alert(`View Users for ${row.valuationFirmName}`)}>
              <Icon name="users" /> View Users
            </DropdownItem>
            <DropdownItem onClick={() => alert(`View Details for ${row.valuationFirmName}`)}>
              <Icon name="eye" /> View Details
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <PreviewCard>
      <BlockHead size="lg" wide="sm">
        <BlockHeadContent>
          <h4 className="fw-bold">Valuation Firms</h4>
        </BlockHeadContent>
      </BlockHead>

      <Card className="card-bordered bg-light">
        <CardBody>
          <Row className="align-items-center g-3 mb-3">
            <Col md={8}>
              <input
                type="search"
                className="form-control"
                placeholder="Search by organization name"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Col>
            <Col md={2}>
              <select
                className="form-select"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[1, 5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    Show {n}
                  </option>
                ))}
              </select>
            </Col>
            <Col md={2}>
              <Button color="primary" className="w-100" onClick={() => setOpenUserDetailsModal(true)}>
                <Icon name="plus" /> New User
              </Button>
            </Col>
          </Row>

          <DataTable
            columns={columns}
            data={tableData}
            progressPending={isLoading}
            noDataComponent={<div className="p-3 text-center">No records found.</div>}
            highlightOnHover
            pointerOnHover
            responsive
            striped
            expandableRows={mobileView}
            expandableRowsComponent={ExpandableRowComponent}
          />

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted">
              Showing {tableData.length} of {alluserslist?.firms?.total || 0} entries
            </span>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={openUserDetailsModal} toggle={() => setOpenUserDetailsModal(!openUserDetailsModal)}>
        <ModalHeader toggle={() => setOpenUserDetailsModal(false)}>Invite User</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmitInvite)}>
            <Row className="g-3">
              <Col md={12}>
                <label className="form-label">Invite As</label>
                <Controller
                  name="invite_as"
                  control={control}
                  render={({ field }) => <Select {...field} options={allRolesList} isClearable />}
                />
                {errors.invite_as && <small className="text-danger">{errors.invite_as.message}</small>}
              </Col>
              <Col md={12}>
                <label className="form-label">Full Names</label>
                <input className="form-control" {...register("full_names")} />
                {errors.full_names && <small className="text-danger">{errors.full_names.message}</small>}
              </Col>
              <Col md={12}>
                <label className="form-label">Login Email</label>
                <input className="form-control" {...register("login_email")} />
                {errors.login_email && <small className="text-danger">{errors.login_email.message}</small>}
              </Col>
              <Col md={6}>
                <label className="form-label">VRB Number</label>
                <input className="form-control" {...register("vrb_number")} />
              </Col>
              <Col md={6}>
                <label className="form-label">ISK Number</label>
                <input className="form-control" {...register("isk_number")} />
              </Col>
              <Col md={12}>
                <label className="form-label">Phone Number</label>
                <input className="form-control" {...register("phone_number")} />
                {errors.phone_number && <small className="text-danger">{errors.phone_number.message}</small>}
              </Col>
            </Row>
            <div className="text-end mt-3">
              <Button color="primary" disabled={sendingInvite} type="submit">
                {sendingInvite ? "Sending..." : "Submit"}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </PreviewCard>
  );
};

export default ValuationFirms;
