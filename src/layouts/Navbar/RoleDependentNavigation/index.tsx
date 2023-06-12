import { useAuthentication } from "../../../middleware/hooks/useAuthentication"
import { UserRole } from "../../../models/user.model";
import AdminNavbarNavigation from "./admin-navigation";
import AuthorizedNavbarNavigation from "./customer-navigation";
import UnauthorizedNavbarNavigation from "./unauthorized-navigation";

const RoleDependentNavigation: React.FC = () => {
  const { user } = useAuthentication();

  switch (user?.role) {
    case UserRole.Admin:
      return (
        <AdminNavbarNavigation />
      );

    case UserRole.User:
      return (
        <AuthorizedNavbarNavigation />
      );

    default:
      return (
        <UnauthorizedNavbarNavigation />
      );
  }
}

export default RoleDependentNavigation;