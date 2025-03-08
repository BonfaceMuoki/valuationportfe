import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Layout from "./layout/Index";
// import AuthLayout from "./layouts/AuthLayout";
import Login from "./auth/Login";
import RequestValuerAccesor from "./auth/Signup";
import RequestAccesorAccess from "./auth/SigninAccesor";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "./layout/provider/Theme";
import ProtectedRoutes from "./auth/routes/ProtectedRoutes";
import UserProfileRegularPage from "./pages/adminProfile/UserProfileRegular";
import ValuerDashboard from "./pages/ValuerDashboard";

import AcceptAccesorInviteSignup from "./auth/AcceptAccesorInviteSignup";
import LayoutNoSidebar from "./layout/Index-nosidebar";
import AcceptInviteSignup from "./auth/AcceptInviteSignup";
import ReportSubmit from "./pages/valuerspages/ReportSubmit";
import AuthorizeRoute from "./auth/routes/AuthorizeRoute";
import AuthorizeRouteByRole from "./auth/routes/AuthorizeRouteByRole";
import Unauthorized from "./pages/errors/Unauthorized";
import RoleList from "./pages/accesorpages/RoleList";
import PermissionList from "./pages/accesorpages/PermissionList";
import ValuerReports from "./pages/valuerspages/ValuerReports";
import ComingSoonPage from "./pages/ComingSoonPage";
import UsersList from "./pages/valuerspages/UsersList";
import AcceptValuerUserInviteSignup from "./auth/AcceptValuerUserInviteSignup";
import MyValuersInviteList from "./pages/valuerspages/MyValuersInviteList";
import ValuationFirms from "./pages/adminpages/ValuationFirms";
import AccesorFirms from "./pages/adminpages/AccesorFirms";

import ValuerAccessInvites from "./pages/valuerspages/ValuerAccessInvites";
import AccesorRequestInvites from "./pages/accesorpages/AccesorRequestInvites";
import OrgUsersList from "./pages/adminpages/OrgUsersList";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route element={<LayoutNoSidebar />}>
              <Route path="/login" element={<Login />} />
              <Route path="/request-valuer-access" element={<RequestValuerAccesor />} />
              <Route path="/request-accesor-access" element={<RequestAccesorAccess />} />
              <Route path="/complete-accesor-invite-by-registering" element={<AcceptAccesorInviteSignup />} />
              <Route path="/complete-invite-by-registering" element={<AcceptInviteSignup />} />
              <Route path="/complete-valuer-user-registration-register" element={<AcceptValuerUserInviteSignup />} />

              {/* <Route path="/upload-new-report"  element={<MapWithAutoSearch />}></Route> */}
            </Route>
            <Route element={<ProtectedRoutes />}>
              <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
                {/* common routes */}
                <Route path="/unauthorized" element={<Unauthorized />}></Route>
                <Route
                  element={
                    <AuthorizeRoute
                      checkpermission={[
                        "view super admin dashbaord",
                        "view valuation firm dashboard",
                        "view accesors dashboard",
                      ]}
                    />
                  }
                >
                  <Route index element={<Homepage />}></Route>
                </Route>
                {/* common routes */}
                {/* accesor dashbooard */}
                <Route element={<AuthorizeRoute checkpermission={["view accesors dashboard"]} />}></Route>
                {/* accesor dashboard */}
                {/* valuer dashbooard */}
                <Route element={<AuthorizeRoute checkpermission={["view valuer dashboard"]} />}>
                  <Route path="/valuer-dashboard" element={<ValuerDashboard />}></Route>
                </Route>
                <Route element={<AuthorizeRoute checkpermission={["view valuer dashboard"]} />}>
                  <Route path="/valuer-dashboard" element={<ValuerDashboard />}></Route>
                </Route>
                <Route element={<AuthorizeRoute checkpermission={["view Accesor dashboard"]} />}>
                  <Route path="/valuer-dashboard" element={<ValuerDashboard />}></Route>
                </Route>
                <Route element={<AuthorizeRoute checkpermission={["upload report"]} />}>
                  <Route path="/upload-new-report" element={<ReportSubmit />}></Route>
                </Route>
                <Route element={<AuthorizeRoute checkpermission={["upload report"]} />}>
                  <Route path="/valuation-firm/my-reports" element={<ValuerReports />}></Route>
                </Route>
                <Route element={<AuthorizeRoute checkpermission={["upload report"]} />}>
                  <Route path="/valuation-firm/my-comparables" element={<ComingSoonPage />}></Route>
                </Route>
                <Route element={<AuthorizeRoute checkpermission={["upload report"]} />}>
                  <Route path="/valuation-firm/my-users" element={<UsersList />}></Route>
                </Route>
                <Route element={<AuthorizeRoute checkpermission={["upload report"]} />}>
                  <Route path="/valuation-firm/my-users-invite" element={<MyValuersInviteList />}></Route>
                </Route>

                {/* valuer dashboard */}
                {/* admin dashbooard */}
                <Route element={<AuthorizeRouteByRole checkrole={["Super Admin"]} />}>
                  <Route path="/admin-profile" element={<UserProfileRegularPage />}></Route>
                  <Route path="/admin/roles" element={<RoleList />}></Route>
                  <Route path="/admin/permissions" element={<PermissionList />}></Route>
                  <Route path="/admin/role-permissions" element={<UserProfileRegularPage />}></Route>
                  <Route path="/admin/valuation-firms" element={<ValuationFirms />}></Route>
                  <Route path="/admin/accesors" element={<AccesorFirms />}></Route>

                  <Route path="/admin/accesor-requests" element={<AccesorRequestInvites />}></Route>
                  <Route path="/admin/valuation-firm-requests" element={<ValuerAccessInvites />}></Route>
                  <Route path="/admin/organization-users" element={<OrgUsersList />}></Route>
                </Route>
                {/* admin dashboard */}
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};
export default App;
