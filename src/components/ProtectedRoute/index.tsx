import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";

interface ProtectedRouteProps {
  readonly redirectPath: string;
  readonly allowed: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { user, userIsLoading } = useAuthentication();
  const { 
    allowed,
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

  if (!allowed) {
    return (
      <h1>Forbidden</h1>
    )
  }

  return (
    <Outlet />
  );
}

export default ProtectedRoute;