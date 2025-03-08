import React, { useState } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import RecentInvest from "../components/partials/invest/recent-investment/RecentInvest";
import Notifications from "../components/partials/default/notification/Notification";
import { DropdownToggle, DropdownMenu, Card, UncontrolledDropdown, DropdownItem } from "reactstrap";

import {
  useGetAccesorRequestsQuery,
  useApproveAccesorRequestMutation,
  useRejectAccesorRequestMutation,
} from "../api/admin/accesorRequestsSlliceApi";
import {
  Block,
  BlockDes,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  PreviewAltCard,
  TooltipComponent,
} from "../components/Component";
import { BalanceBarChart, DepositBarChart, WithdrawBarChart } from "../components/partials/charts/invest/InvestChart";
import ValuerReports from "./valuerspages/ValuerReports";
import { selectCurrentUser } from "../featuers/authSlice";
import { useSelector } from "react-redux";
import AccesorReports from "./valuerspages/AccessorReports";

const AccesorDashboard = () => {
  const [sm, updateSm] = useState(false);

  const user = useSelector(selectCurrentUser);

  return (
    <>
      <Head title="Invest Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Home Dashboard</BlockTitle>
              <BlockDes className="text-soft">
                <p>{user?.role_name} !!!!</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="more-v"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button color="primary" outline className="btn-dim btn-white">
                        <Icon name="mail"></Icon>
                        <span>New Broadcast Message</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col md="6">
              <PreviewAltCard className="card-full">
                <div className="card-title-group align-start mb-0">
                  <div className="card-title">
                    <h6 className="subtitle">Panel Valuers</h6>
                  </div>
                  <div className="card-tools">
                    <TooltipComponent
                      iconClass="card-hint"
                      icon="help-fill"
                      direction="left"
                      id="invest-deposit"
                      text="Total Deposited"
                    ></TooltipComponent>
                  </div>
                </div>
                <div className="card-amount">
                  <span className="amount">4</span>
                  <span className="change up text-success">{/* <Icon name="arrow-long-up"></Icon>1.93% */}</span>
                </div>
                <div className="invest-data">
                  <div className="invest-data-amount g-2">
                    <div className="invest-data-history">
                      <div className="title">Active</div>
                      <span className="amount">
                        2 <span className="currency currency-usd"> Valuers</span>
                      </span>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Inactive </div>
                      <span className="amount">
                        2 <span className="currency currency-usd"> Valuers</span>
                      </span>
                    </div>
                  </div>
                  <div className="invest-data-ck">
                    <DepositBarChart />
                  </div>
                </div>
              </PreviewAltCard>
            </Col>

            <Col md="6">
              <PreviewAltCard className="card-full">
                <div className="card-title-group align-start mb-0">
                  <div className="card-title">
                    <h6 className="subtitle">Valuation Reports</h6>
                  </div>
                  <div className="card-tools">
                    <TooltipComponent
                      iconClass="card-hint"
                      icon="help-fill"
                      direction="left"
                      id="invest-withdraw"
                      text="Total Withdrawn"
                    ></TooltipComponent>
                  </div>
                </div>
                <div className="card-amount">
                  <span className="amount">
                    5<span className="currency currency-usd"></span>
                  </span>
                  <span className="change down text-danger">{/* <Icon name="arrow-long-down"></Icon>1.93% */}</span>
                </div>
                <div className="invest-data">
                  <div className="invest-data-amount g-2">
                    <div className="invest-data-history">
                      <div className="title">Ongoing Valuations</div>
                      <div className="amount">
                        3<span className="currency currency-usd"></span>
                      </div>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Submitted</div>
                      <div className="amount">
                        2<span className="currency currency-usd"> Reports</span>
                      </div>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Past Due</div>
                      <div className="amount">
                        2<span className="currency currency-usd"> Reports</span>
                      </div>
                    </div>
                  </div>
                  <div className="invest-data-ck">
                    <WithdrawBarChart />
                  </div>
                </div>
              </PreviewAltCard>
            </Col>

            <Col xl="12" xxl="12">
              <Card className="card-bordered card-full">
                <AccesorReports showsearchbar={false} />
              </Card>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default AccesorDashboard;
