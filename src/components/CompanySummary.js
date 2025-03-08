
import React, { useContext, useState } from "react";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap";
import {
  Icon,
  UserAvatar,
  Button,
  PreviewAltCard,
} from "./Component";
import { findUpper } from "../utils/Utils";
function CompanySummary({ item, companytypes }) {
  console.log("passed data");
  console.log(item);
  return (
    <PreviewAltCard>
      <div className="team">
        <div className="team-options">
          <UncontrolledDropdown>
            <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
              <Icon name="more-h"></Icon>
            </DropdownToggle>
            <DropdownMenu end>
              <ul className="link-list-opt no-bdr">
                {/* <li onClick={() => onEditClick(item.id)}>
                <DropdownItem
                  tag="a"
                  href="#edit"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <Icon name="edit"></Icon>
                  <span>Edit</span>
                </DropdownItem>
              </li>
              <li className="divider"></li>
              <li onClick={() => suspendUser(item.id)}>
                <DropdownItem
                  href="#suspend"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <Icon name="na"></Icon>
                  <span>Suspend User</span>
                </DropdownItem>
              </li> */}
              </ul>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <div className="user-card user-card-s2">
          {(companytypes == "Accessor") &&
            <>
              <UserAvatar theme={item.avatarBg} className="lg" text={findUpper(item.institution_name)} image="">
                <div className="status dot dot-lg dot-success"></div>
              </UserAvatar>
              <div className="user-info">
                <h6>{item.institution_name}</h6>
                {/* <span className="sub-text">@{item.institution_name.split(" ")[0].toLowerCase()}</span> */}
              </div>
            </>
          }
          {(companytypes == "valuer") &&
            <>
              <UserAvatar theme={item.avatarBg} className="lg" text={findUpper(item.valauaion_firm_name)} image="">
                <div className="status dot dot-lg dot-success"></div>
              </UserAvatar>
              <div className="user-info">
                <h6>{item.valauaion_firm_name}</h6>
                {/* <span className="sub-text">@{item.institution_name.split(" ")[0].toLowerCase()}</span> */}
              </div>
            </>
          }
        </div>

        <div className="team-details">
          <p>{companytypes}</p>
        </div>
        {(companytypes == "Accessor") &&
          <ul className="team-info">
            <li>
              <span>Contact Person</span>
              <span>{item.contact_person_name}</span>
            </li>
            <li>
              <span>Contact Phone</span>
              <span>{item.contact_person_phone}</span>
            </li>
            <li>
              <span>Email</span>
              <span>{item.invite_email}</span>
            </li>
          </ul>
        }
        {(companytypes == "valuer") &&
          <ul className="team-info">
            <li>
              <span>Director Name</span>
              <span>{item.director_name}</span>
            </li>
            <li>
              <span>Contact Phone</span>
              <span>{item.invite_phone}</span>
            </li>
            <li>
              <span>Email</span>
              <span>{item.invite_email}</span>
            </li>
            <li>
              <span>ISK Name</span>
              <span>{item.isk_number}</span>
            </li>
            <li>
              <span>VRB Name</span>
              <span>{item.vrb_number}</span>
            </li>
          </ul>
        }
        <div className="team-view">
          {/* <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}>
          <Button color="primary" className="btn-block btn-dim">
            <span>View Profile</span>
          </Button>
        </Link> */}
        </div>
      </div>
    </PreviewAltCard>
  )
}

export default CompanySummary