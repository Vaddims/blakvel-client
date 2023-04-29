import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../../models/user.model";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";

interface ProtectedRouteProps {
  readonly redirectPath: string;
  readonly allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { user, userIsLoading } = useAuthentication();
  const { 
    allowedRoles, 
    redirectPath,
  } = props;

  if (userIsLoading) {
    return (
      <h1>loading</h1>
    )
  }

  if (!user) {
    return (
      <Navigate to={redirectPath} replace />
    );
  }

  if (!allowedRoles.some((role) => user.role === role)) {
    return (
      <h1>Forbidden</h1>
    )
  }

  return (
    <Outlet />
  );
}

export default ProtectedRoute;