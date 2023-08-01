import { UserDto } from "../../../dto/user/user.dto";
import { useAuthentication } from "../../../middleware/hooks/useAuthentication"
import AdminNavbarNavigation from "./admin-navigation";
import AuthorizedNavbarNavigation from "./customer-navigation";
import UnauthorizedNavbarNavigation from "./unauthorized-navigation";

const RoleDependentNavigation: React.FC = () => {
  const { user } = useAuthentication();

  switch (user?.role) {
    case UserDto.Role.Admin:
      return (
        <AdminNavbarNavigation />
      );

    case UserDto.Role.Customer:
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