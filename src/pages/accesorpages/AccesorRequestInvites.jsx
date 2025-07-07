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
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  useGetAccesorRequestsQuery,
  useApproveAccesorRequestMutation,
  useRejectAccesorRequestMutation,
} from "../../api/admin/accesorRequestsSlliceApi";
import { useArchiveAccesorRegistrationRequestMutation } from "../../api/auth/inviteAccesorApiSlice";

import CompanySummary from "../../components/CompanySummary";
import { findUpper } from "../../utils/Utils";

const CloseButton = () => (
  <span className="btn-trigger toast-close-button" role="button">
    <Icon name="cross" />
  </span>
);

const AccesorRequestInvites = () => {
  const [modalSm, setModalSm] = useState(false);
  const [modalOpenCompanyDetails, setModalOpenCompanyDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [activeRequest, setActiveRequest] = useState(0);
  const [fullActiveRequest, setFullActiveRequest] = useState(null);

  const {
    data,
    isFetching,
    isLoading,
    refetch: refetchFirmRequests,
    isSuccess,
    isError,
    error,
  } = useGetAccesorRequestsQuery({
    currentPage,
    rowsPerPage: itemPerPage,
    searchText: "",
    orderColumn: "name",
    sortOrder: "asc",
  });

  const [acceptAccesorAccessRequest] = useApproveAccesorRequestMutation();
  const [rejectValuationFirmRequest] = useRejectAccesorRequestMutation();
  const [archiveRequestt] = useArchiveAccesorRegistrationRequestMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setCurrentPage(data.requests.current_page);
      setItemPerPage(data.requests.per_page);
    }
  }, [isSuccess, data]);

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

  const approveFirm = (firm) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to approve ${firm?.institution_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        acceptAcceptingRegistration(firm);
      }
    });
  };

  const declineFirm = (firm) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to decline ${firm?.institution_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, decline it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setActiveRequest(firm?.id);
        setModalSm(true);
      }
    });
  };

  const schema = yup.object().shape({
    reasonForRejection: yup.string().required("Reason is required"),
  });

  const {
    register: registerDeclineForm,
    handleSubmit: handleSubmitDeclineForm,
    formState: { errors: registerDeclineFormErrors },
  } = useForm({ resolver: yupResolver(schema) });

  const acceptAcceptingRegistration = async (firm) => {
    const result = await acceptAccesorAccessRequest({ requestId: firm.id });
    if (result?.error) {
      toastMessage(result.error.data.message, "error");
    } else {
      toastMessage(result.data.message, "success");
      refetchFirmRequests();
    }
  };

  const submitDeclineRequest = async (formData) => {
    const payload = new FormData();
    payload.append("invite", activeRequest);
    payload.append("reason", formData.reasonForRejection);

    const result = await rejectValuationFirmRequest(payload);
    if (result?.error) {
      Swal.fire("Decline Failed", result.error.data.message, "warning");
    } else {
      toastMessage(result.data.message, "success");
      refetchFirmRequests();
      setModalSm(false);
    }
  };

  const archiveRequest = async (row) => {
    const formData = new FormData();
    formData.append("invite", row.id);
    await archiveRequestt(formData);
    refetchFirmRequests();
  };

  const viewRegistrationStatus = (row) => {
    setFullActiveRequest(row);
    setActiveRequest(row.id);
    setModalOpenCompanyDetails(true);
  };

  if (!data?.requests?.data?.length) return null;

  return (
    <PreviewCard>
      {/* Company Details Modal */}
      <Modal size="sm" isOpen={modalOpenCompanyDetails} toggle={() => setModalOpenCompanyDetails(!modalOpenCompanyDetails)}>
        <ModalHeader toggle={() => setModalOpenCompanyDetails(false)}>
          Company Information
        </ModalHeader>
        <ModalBody>
          <CompanySummary item={fullActiveRequest} companytypes="Accessor" />
        </ModalBody>
      </Modal>

      {/* Decline Reason Modal */}
      <Modal size="sm" isOpen={modalSm} toggle={() => setModalSm(!modalSm)}>
        <ModalHeader toggle={() => setModalSm(false)}>Reason For Decline</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitDeclineForm(submitDeclineRequest)}>
            <textarea
              placeholder="Reason for rejection / Next action"
              className="form-control"
              rows={4}
              {...registerDeclineForm("reasonForRejection")}
            />
            <span className="text-danger">{registerDeclineFormErrors.reasonForRejection?.message}</span>
            <Button type="submit" color="primary" className="mt-3">
              <Icon name="send" /> Submit
            </Button>
          </form>
        </ModalBody>
      </Modal>

      <BlockHead size="lg">
        <BlockHeadContent>
          <h4 className="mb-1 text-uppercase fw-bold text-primary">
            Accessors Access Requests
          </h4>
          <p className="text-muted small">Manage registration requests submitted by accessor firms</p>
        </BlockHeadContent>
      </BlockHead>

      <DataTable className="card-stretch">
        <DataTableBody>
          <DataTableHead className="table-light border-bottom">
            <DataTableRow>
              <span className="text-uppercase fw-bold text-dark small">Company Name</span>
            </DataTableRow>
            <DataTableRow>
              <span className="text-uppercase fw-bold text-dark small">Contact Person</span>
            </DataTableRow>
            <DataTableRow>
              <span className="text-uppercase fw-bold text-dark small">ISK Info</span>
            </DataTableRow>
            <DataTableRow className="text-end">
              <span className="text-uppercase fw-bold text-dark small">Action</span>
            </DataTableRow>
          </DataTableHead>

          {data.requests.data.map((item) => (
            <DataTableItem key={item.id}>
              <DataTableRow>
                <Link to={`/user-details-regular/${item.id}`} className="d-flex align-items-center gap-2">
                  <UserAvatar theme={item.avatarBg} text={findUpper(item.consumerName || "")} />
                  <div>
                    <span className="fw-semibold text-dark d-block">{item.consumerName}</span>
                    <small className="text-muted">{item.consumerEmail}</small>
                  </div>
                </Link>
              </DataTableRow>
              <DataTableRow>
                <span>{item.consumerContactPersonName}</span><br />
                <small className="text-muted">{item.consumerContactPersonPhone}</small>
              </DataTableRow>
              <DataTableRow><span className="badge bg-secondary">Type: {item.consumerType}</span></DataTableRow>
              <DataTableRow className="text-end">
                <UncontrolledDropdown>
                  <DropdownToggle className="btn btn-sm btn-outline-secondary">
                    <Icon name="more-h" />
                  </DropdownToggle>
                  <DropdownMenu end>
                    <ul className="link-list-opt no-bdr">
                      {item.approvalStatus === "PENDING" && (
                        <>
                          <li><DropdownItem onClick={() => approveFirm(item)}><Icon name="check" /> Approve</DropdownItem></li>
                          <li><DropdownItem onClick={() => declineFirm(item)}><Icon name="cross" /> Decline</DropdownItem></li>
                        </>
                      )}
                      {item.status === "Approved" && (
                        <li><DropdownItem onClick={() => viewRegistrationStatus(item)}><Icon name="eye" /> View Registration Status</DropdownItem></li>
                      )}
                      {item.status === "Rejected" && (
                        <li><DropdownItem onClick={() => archiveRequest(item)}><Icon name="archive" /> Archive Request</DropdownItem></li>
                      )}
                      {item.status === "Registered" && (
                        <li><DropdownItem onClick={() => viewRegistrationStatus(item)}><Icon name="eye" /> View Company Details</DropdownItem></li>
                      )}
                    </ul>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </DataTableRow>
            </DataTableItem>
          ))}
        </DataTableBody>

        <div className="card-inner">
          <PaginationComponent
            itemPerPage={data.requests.per_page}
            totalItems={data.requests.total}
            paginate={setCurrentPage}
            currentPage={data.requests.current_page}
          />
        </div>
      </DataTable>
    </PreviewCard>
  );
};

export default AccesorRequestInvites;
