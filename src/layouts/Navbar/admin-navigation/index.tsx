import { useAppDispatch } from "../../../middleware/hooks/reduxAppHooks";
import { useLogoutMutation } from "../../../services/api/usersApi";
import { setUser } from "../../../services/slices/userSlice";
import { useRedirection } from "../../../utils/hooks/useRedirection";

function AdminNavbarNavigation() {
  const redirect = useRedirection();
  const [ logout ] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const logoutUser = async () => {
    logout();
    localStorage.removeItem('REFRESH_TOKEN_START');
    dispatch(setUser(null));
  }

  return (
    <>
      <li onClick={redirect('/admin-panel')}>Admin Panel</li>
      <li onClick={logoutUser}>Logout</li>
    </>
  )
}

export default AdminNavbarNavigation;