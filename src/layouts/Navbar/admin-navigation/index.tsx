import { useAppDispatch } from "../../../middleware/hooks/reduxAppHooks";
import { useAuthentication } from "../../../middleware/hooks/useAuthentication";
import { useLogoutMutation } from "../../../services/api/usersApi";
import { useRedirection } from "../../../utils/hooks/useRedirection";

function AdminNavbarNavigation() {
  const redirect = useRedirection();
  const authentication = useAuthentication();

  const logoutUser = () => {
    authentication.logout();
  }

  return (
    <>
      <li onClick={redirect('/admin-panel')}>Admin Panel</li>
      <li onClick={logoutUser}>Logout</li>
    </>
  )
}

export default AdminNavbarNavigation;