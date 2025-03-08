import React, { useEffect, useState } from "react";

import ValuerDashboard from "./ValuerDashboard";
import AdminDashboard from "./AdminDashboard";
// import AccesorDashboard from "./AccesorDashboard";
import { selectCurrentUser, selectCurrentRoles } from "../featuers/authSlice";
import { useSelector } from "react-redux";
import AccesorDashboard from "./AccesorDashboard";

const HomePage = () => {
  const [sm, updateSm] = useState(false);
  const currentuser = useSelector(selectCurrentUser);
  const [currentRole, setCurrentRole] = useState();
  useEffect(() => {
    if (currentuser != null && currentuser != undefined) {
      setCurrentRole(currentuser?.role_name);
    }
  }, [currentuser]);
  console.log(currentuser, "currentuser");

  const [adminRoles, setAdminRoles] = useState(["Super Admin"]);
  const [valuerRoles, setValuerRoles] = useState([
    "Valuation Firm Director",
    "Report Uploader Admin",
    "Report Uploader",
  ]);
  const [accesorRoles, setAccesorRoles] = useState(["Report Accessor Admin", "Report Accessor"]);


  return (
    <>
    {valuerRoles.includes(currentRole) && <ValuerDashboard />}
    {adminRoles.includes(currentRole) && <AdminDashboard />}
    {accesorRoles.includes(currentRole) && <AccesorDashboard />}
    
    {!currentRole && <p>Loading user data...</p>}
    {currentRole &&
      !valuerRoles.includes(currentRole) &&
      !adminRoles.includes(currentRole) &&
      !accesorRoles.includes(currentRole) && (
        <p>No dashboard available for your role.</p>
      )}
  </>
  );
};

export default HomePage;
