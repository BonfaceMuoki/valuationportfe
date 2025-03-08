import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentPermissions, selectCurrentRoles } from "../../featuers/authSlice";

function AuthorizeRoute({ checkpermission }) {
  const location = useLocation();
  console.log(checkpermission, "checkpermissioncheckpermission");
  const roles = useSelector(selectCurrentRoles);
  const permissions = useSelector(selectCurrentPermissions);
  console.log(permissions, "permissionspermissions");
  if(permissions === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
   
  // Check if any permission in checkpermission array exists in user's permissions
  const hasPermission = Array.isArray(checkpermission)
    ? checkpermission.some((cp) => 
        permissions.some(p => p.toLowerCase() === cp.toLowerCase())
      )
    : permissions.some(p => p.toLowerCase() === checkpermission.toLowerCase());
  console.log(hasPermission,"hasPermissionhasPermissionhasPermission");
  return hasPermission ? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace />;
}

export default AuthorizeRoute;
