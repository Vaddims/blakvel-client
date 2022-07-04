import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../../models/user.model";
import { useGetAuthenticatedUserQuery } from "../../services/api/usersApi";

interface ProtectedRouteProps {
  readonly redirectPath: string;
  readonly allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { data: user, isLoading } = useGetAuthenticatedUserQuery();
  const { allowedRoles, redirectPath } = props;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user && allowedRoles.some((role) => user.role === role)) {
    return <Outlet />;
  }

  return (
    <Navigate to={redirectPath} replace />
  );
}

export default ProtectedRoute;