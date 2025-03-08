import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../featuers/authSlice";

const menuadmin = [
  {
    icon: "home",
    text: "Dashboard",
    link: "/",
  },
  {
    icon: "users",
    text: "User Manager",
    active: false,
    subMenu: [
      {
        text: "Valuation Firms",
        link: "/admin/valuation-firms",
      },
      {
        text: "Accesors",
        link: "/admin/accesors",
      },
      {
        text: "Accesor Requests",
        link: "/admin/accesor-requests",
      },
      {
        text: "Valuation Firms' Requests",
        link: "/admin/valuation-firm-requests",
      },
    ],
  },
  {
    icon: "money",
    text: "Valuations",
    active: false,
    subMenu: [
      {
        text: "All Reports",
        link: "/admin/reports",
      },
    ],
  },
  {
    icon: "briefcase",
    text: "Billing",
    active: false,
    subMenu: [
      {
        text: "Payments",
        link: "/admin/all-payments",
      },
    ],
  },
  {
    icon: "setting",
    text: "Settings",
    active: false,
    subMenu: [
      {
        text: "Roles - Roles List",
        link: "/admin/roles",
      },
      {
        text: "Permissions - Permissions List",
        link: "/admin/permissions",
      },
      {
        text: "Roles - Role Permissions",
        link: "/admin/role-permissions",
      },
    ],
  },
];

const menulender = [
  {
    icon: "home",
    text: "Dashboard",
    link: "/",
  },
  {
    icon: "users",
    text: "User Manager",
    active: false,
    subMenu: [
      {
        text: "User List - Valuers",
        link: "/valuation-firm/my-users",
      },
    ],
  },
  {
    icon: "money",
    text: "Valuations",
    active: false,
    subMenu: [
      {
        text: "Reports - My Reports",
        link: "/valuation-firm/my-reports",
      },
      {
        text: "Reports - Share Instructions",
        link: "/valuation-firm/share-new-instruction",
      },
    ],
  },
  {
    icon: "briefcase",
    text: "Billing",
    active: false,
    subMenu: [
      {
        text: "My Credits",
        link: "/my-credits",
      },
      {
        text: "Make Payments",
        link: "/make-payment",
      },
    ],
  },
];

const menuvaluer = [
  {
    icon: "home",
    text: "Dashboard",
    link: "/",
  },
  {
    icon: "users",
    text: "User Manager",
    active: false,
    subMenu: [
      {
        text: "My Registered Valuers",
        link: "/valuation-firm/my-users",
      },
      {
        text: "My Valuer Invites",
        link: "/valuation-firm/my-users-invite",
      },
    ],
  },
  {
    icon: "money",
    text: "Valuations",
    active: false,
    subMenu: [
      {
        text: "My Reports",
        link: "/valuation-firm/my-reports",
      },
      {
        text: "New Report",
        link: "/upload-new-report",
      },
      {
        text: "Comparables",
        link: "/valuation-firm/my-comparables",
      },
    ],
  },
  {
    icon: "briefcase",
    text: "Billing",
    active: false,
    subMenu: [
      {
        text: "My Credits",
        link: "/valuation-firm/my-credits",
      },
      {
        text: "Make Payments",
        link: "/valuation-firm/make-payment",
      },
    ],
  },
];

export { menuadmin, menulender, menuvaluer };