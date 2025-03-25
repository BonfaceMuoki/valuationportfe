import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentPermissions, selectCurrentRoles } from "../../featuers/authSlice";

function AuthorizeRouteByRole({ checkrole }) {
    const location = useLocation();
    const roles = useSelector(selectCurrentRoles);
    const hasRole = Array.isArray(checkrole)
        ? checkrole.some(cp => roles.find(p => p === cp))
        : roles.find(p => p.name === checkrole);
    return (
        hasRole ? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace />
    );
}
export default AuthorizeRouteByRole;
