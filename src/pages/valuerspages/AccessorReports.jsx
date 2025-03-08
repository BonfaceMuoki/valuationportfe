import React, { useEffect, useState } from "react";
import { Icon, PaginationComponent } from "../../components/Component";
import DataTable from "react-data-table-component";
import exportFromJSON from "export-from-json";
import CopyToClipboard from "react-copy-to-clipboard";
import { useGetValuationReportsQuery } from "../../api/admin/valuationFirmRequestsSlice";
import { Card, Row, Col, Button, Modal, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {
  useGetAccesorsListQuery,
  useGetAllCountiesQuery,
  useGetPropertyTypeListQuery,
  useGetUsersQuery,
  useGetValuersListQuery,
} from "../../api/commonEndPointsAPI";

const Export = ({ data }) => {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (modal === true) {
      setTimeout(() => setModal(false), 2000);
    }
  }, [modal]);

  const fileName = "user-data";

  const exportCSV = () => {
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType });
  };

  const exportExcel = () => {
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  };

  const copyToClipboard = ({ data }) => {
    setModal(true);
  };

  return (
    <React.Fragment>
      <div className="dt-export-buttons d-flex align-center">
        <div className="dt-export-title d-none d-md-inline-block">Export</div>
        <div className="dt-buttons btn-group flex-wrap">
          <CopyToClipboard text={JSON.stringify(data)}>
            <Button className="buttons-copy buttons-html5" onClick={() => copyToClipboard()}>
              <span>Copy</span>
            </Button>
          </CopyToClipboard>{" "}
          <button className="btn btn-secondary buttons-csv buttons-html5" type="button" onClick={() => exportCSV()}>
            <span>CSV</span>
          </button>{" "}
          <button className="btn btn-secondary buttons-excel buttons-html5" type="button" onClick={() => exportExcel()}>
            <span>Excel</span>
          </button>{" "}
        </div>
      </div>
      <Modal isOpen={modal} className="modal-dialog-centered text-center" size="sm">
        <ModalBody className="text-center m-2">
          <h5>Copied to clipboard</h5>
        </ModalBody>
        <div className="p-3 bg-light">
          <div className="text-center">Copied {data?.length} rows to clipboard</div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const ExpandableRowComponent = ({ data }) => {
  return (
    <ul className="dtr-details p-2 border-bottom ms-1">
      <li className="d-block d-sm-none">
        <span className="dtr-title">FMV</span> <span className="dtr-data">{data?.forced_market_value}</span>
      </li>
      <li className="d-block d-sm-none">
        <span className="dtr-title ">Market Value</span> <span className="dtr-data">{data.market_value}</span>
      </li>
      <li>
        <span className="dtr-title">Inspection Nate</span> <span className="dtr-data">{data.created_at}</span>
      </li>
      <li>
        <span className="dtr-title">DownLoad</span>{" "}
        <span className="dtr-data">
          <DownLoadReport row={data} />
        </span>
      </li>
    </ul>
  );
};

const CustomCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
  <div className="custom-control custom-control-sm custom-checkbox notext">
    <input id={rest.name} type="checkbox" className="custom-control-input" ref={ref} onClick={onClick} {...rest} />
    <label className="custom-control-label" htmlFor={rest.name} />
  </div>
));
const CustomTitle = ({ row }) => (
  // <div className="user-card">
  //   <UserAvatar
  //     theme={row?.avatarBg}
  //     text={findUpper(
  //       row.organization_name != null && row.organization_name != undefined
  //         ? row.organization_name
  //         : ""
  //     )}
  //     image=""
  //   ></UserAvatar>

  // </div>
  <span>{row?.organization_name}</span>
);
const DownLoadReport = ({ row }) => (
  <div className="user-card" style={{ padding: "10px" }}>
    <a href={`${process.env.REACT_APP_API_BASE_URL}/api/commons/download-report?report=${row.id}`}>
      <Button outline color="primary" className="btn-round">
        {" "}
        <Icon name="download"></Icon> Download{" "}
      </Button>
    </a>
  </div>
);

const ConvertDate = ({ row }) => {
  const date = new Date(row.created_at);

  // Define arrays for month names and day names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Extract day, month, year, and day of the week
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const dayOfWeek = date.getUTCDay();

  // Create the wordy date using template literals
  const wordyDate = `${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}, ${year}`;

  return (
    <div className="user-card">
      <span color="primary">
        {" "}
        <Icon name="calender"></Icon> {wordyDate}
      </span>
    </div>
  );
};

const AccesorReports = ({ showsearchbar = true }) => {
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPageS, setRowsPerPageS] = useState(5);
  const [mobileView, setMobileView] = useState();
  const [actions, setActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [totalRecords, setTotalRecords] = useState();
  const [orderColumn, setOrderColumn] = useState("organization_name");
  const [sortOrder, setSortOrder] = useState("ASC");

  const { data: allthereports, isLoading } = useGetValuationReportsQuery({
    currentPage,
    rowsPerPageS,
    searchText,
    orderColumn,
    sortOrder,
  });

  useEffect(() => {
    if (allthereports != undefined) {
      setTableData(allthereports?.data);
      setTotalRecords(allthereports?.total);
    }
  }, [allthereports]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [columns, setColumns] = useState([
    {
      name: "Client Name",
      selector: (row) => row.organization_name,
      sortable: true,
      cell: (row) => <CustomTitle row={row} />,
    },
    {
      name: "LR Number",
      selector: (row) => row.property_lr,
      sortable: true,
      hide: 370,
    },
    {
      name: "FMV",
      selector: (row) => row.forced_market_value,
      sortable: true,
      hide: "sm",
    },
    {
      name: "Market Value",
      selector: (row) => row.market_value,
      sortable: true,
      hide: "sm",
    },
    {
      name: "Inspection Date",
      selector: (row) => row.created_at,
      sortable: true,
      hide: "md",
      cell: (row) => <ConvertDate row={row} />,
    },
    {
      name: "Report",
      selector: (row) => row.market_value,
      sortable: true,
      hide: "md",
      cell: (row) => <DownLoadReport row={row} />,
    },
  ]);

  // function to change the design view under 1200 px
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const className = "nk-tb-list";

  const [activeTab, setActivetab] = useState("1");

  const toggle = (tab) => {
    setActivetab(tab);
  };

  const {
    data: accesorslist,
    isLoading: loadingAccesors,
    isSuccess: accesorsLoaded,
    isError: errorLodingAccesors,
    error: loadingAccesorError,
  } = useGetValuersListQuery();
  // console.log("Accesors List");
  console.log(accesorslist, "Acessd ");
  const [existingAccessors, setExistingAccessors] = useState();
  useEffect(() => {
    if (accesorslist?.data != undefined) {
      const restructuredData = accesorslist?.data.map(({ id, organization_name }) => ({
        value: id,
        label: organization_name,
        name: organization_name,
      }));
      setExistingAccessors(restructuredData);
    }
  }, [accesorslist]);

  const [propertytypesList, setPropertytypesList] = useState();
  const { data: registeredpropertytypes, isLoading: loadingpropertytypes } = useGetPropertyTypeListQuery();
  // console.log(registeredpropertytypes, "registeredpropertytypes");
  useEffect(() => {
    if (registeredpropertytypes != undefined) {
      const restructuredData = registeredpropertytypes.map(({ id, type_name }) => ({
        id: id,
        value: id,
        label: type_name,
      }));
      setPropertytypesList(restructuredData);
    }
  }, [loadingpropertytypes]);

  const [countiesList, setCountiesList] = useState();
  const { data: counties, isLoading: loadingcounties } = useGetAllCountiesQuery();
  // console.log(registeredpropertytypes, "registeredpropertytypes");
  useEffect(() => {
    if (counties != undefined) {
      const restructuredData = counties.map(({ id, name }) => ({
        id: id,
        value: id,
        label: name,
      }));
      setCountiesList(restructuredData);
    }
  }, [loadingcounties]);

  //get the registered signatories
  const [signatoriesList, setSignatoriesList] = useState();
  const { data: registeredusers, isLoading: loadingusers } = useGetUsersQuery();
  // console.log(registeredusers, "registeredusers");
  useEffect(() => {
    if (registeredusers != undefined) {
      const restructuredData = registeredusers.map(({ id, full_name, email, phone }) => ({
        id: id,
        value: id,
        label: full_name,
        email: email,
        phone: phone,
      }));
      setSignatoriesList(restructuredData);
    }
  }, [loadingusers]);
  //get the registered signnaries

  const [startDate, setStartDate] = useState(new Date());
  const [startIconDate, setStartIconDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [month, setMonth] = useState(new Date());
  const [year, setYear] = useState(new Date());
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState();
  const [rangeDate, setRangeDate] = useState({
    start: new Date(),
    end: null,
  });

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Card className="card-bordered" style={{ width: "95%", marginTop: "7%", marginBottom: "10%", padding: "3%" }}>
        <div className={`dataTables_wrapper dt-bootstrap4 no-footer ${className ? className : ""}`}>
          {showsearchbar ? (
            <Card
              className="card-bordered"
              style={{ padding: "15px 35px 25px 35px", borderRadius: "45px", backgroundColor: "#F2F3F5" }}
            >
              <Row>
                <Col>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "1" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle("1");
                        }}
                      >
                        Simple Search {showsearchbar}
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle("2");
                        }}
                      >
                        Advanced Search
                      </NavLink>
                    </NavItem>
                    <NavItem></NavItem>
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Row className={`justify-between g-2 ${actions ? "with-export" : ""}`}>
                        <Col className="col-12 text-start" sm="12" style={{}}>
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            className="form-control"
                            placeholder="Organization Name or LR number or Market value or property type "
                            onChange={(ev) => {
                              setSearchText(ev.target.value);
                              setCurrentPage(1);
                            }}
                          />
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row className={`justify-between g-2 ${actions ? "with-export" : ""}`}>
                        <Col className="text-start" sm="12" md="3" style={{}}>
                          {existingAccessors && existingAccessors.length > 0 && (
                            <Select options={existingAccessors} isSearchable={true} placeholder="Organization" />
                          )}
                        </Col>
                        <Col className="text-start" sm="12" md="3" style={{}}>
                          {propertytypesList && propertytypesList.length > 0 && (
                            <Select options={propertytypesList} isSearchable={true} placeholder="Property Type" />
                          )}
                        </Col>
                        <Col className=" text-start" sm="12" md="3" style={{}}>
                          {countiesList && countiesList.length > 0 && (
                            <Select options={countiesList} isSearchable={true} placeholder="County" />
                          )}
                        </Col>
                        <Col className="text-start" sm="12" md="3" style={{}}>
                          {signatoriesList && signatoriesList.length > 0 && (
                            <Select options={signatoriesList} isSearchable={true} placeholder="Valuer" />
                          )}
                        </Col>
                      </Row>
                      <hr></hr>
                      <Row>
                        <Col className="text-start" sm="12" md="4" style={{}}>
                          <div className="form-group">
                            Valuation Date <br></br>
                            <div className="form-control-wrap">
                              <div className="input-daterange date-picker-range input-group">
                                <DatePicker
                                  selected={rangeStart}
                                  onChange={setRangeStart}
                                  selectsStart
                                  startDate={rangeStart}
                                  endDate={rangeEnd}
                                  wrapperClassName="start-m"
                                  className="form-control"
                                />{" "}
                                <div className="input-group-addon">TO</div>
                                <DatePicker
                                  selected={rangeEnd}
                                  onChange={setRangeEnd}
                                  startDate={rangeStart}
                                  endDate={rangeEnd}
                                  selectsEnd
                                  minDate={rangeStart}
                                  wrapperClassName="end-m"
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col className="text-start" sm="12" md="6" style={{}}>
                          <span>Search KeyWord</span>
                          <br></br>
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            className="form-control"
                            placeholder="Organization Name or LR number or Market value or property type "
                            onChange={(ev) => {
                              setSearchText(ev.target.value);
                              setCurrentPage(1);
                            }}
                          />
                        </Col>
                        <Col className=" text-end" sm="12" md="2">
                          <span></span>
                          <br></br>
                          <Button className="btn-round" color="primary" size="md">
                            Apply <Icon name="filter"></Icon>
                          </Button>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </Col>
              </Row>
            </Card>
          ) : (
            <span></span>
          )}

          <Row style={{ marginTop: "20px" }}>
            <Col className="text-end" sm="12">
              <div id="DataTables_Table_0_filter" className="dataTables_filter">
                <label>
                  <select
                    name="DataTables_Table_0_length"
                    className="form-control "
                    onChange={(e) => setRowsPerPageS(e.target.value)}
                    value={rowsPerPageS}
                  >
                    <option value="5">5 Records</option>
                    <option value="10">10 Records</option>
                    <option value="15">15 Records</option>
                    <option value="20">20 Records</option>
                    <option value="25">25 Records</option>
                    <option value="40">40 Records</option>
                    <option value="50">50 records</option>
                  </select>{" "}
                </label>
              </div>
            </Col>
          </Row>
          <DataTable
            data={tableData}
            columns={columns}
            className="nk-tb-list"
            // selectableRows={selectableRows}
            selectableRowsComponent={CustomCheckbox}
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
          <div className="card-inner">
            {tableData != null && tableData != undefined ? (
              <PaginationComponent
                itemPerPage={rowsPerPageS}
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
        </div>
      </Card>
    </div>
  );
};
export default AccesorReports;
