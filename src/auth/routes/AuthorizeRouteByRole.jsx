import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentPermissions, selectCurrentRoles } from "../../featuers/authSlice";

function AuthorizeRouteByRole({ checkrole }) {
    const location = useLocation();
    console.log(checkrole, "checkrolecheckrole");

    const roles = useSelector(selectCurrentRoles);
    console.log(roles, "roles");

    // Check if any permission in checkpermission array exists in user's permissions
    const hasRole = Array.isArray(checkrole)
        ? checkrole.some(cp => roles.find(p => p.name === cp))
        : roles.find(p => p.name === checkrole);
    return (
        hasRole ? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace />
    );
}

export default AuthorizeRouteByRole;
