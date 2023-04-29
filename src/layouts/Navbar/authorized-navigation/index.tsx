import { useAuthentication } from "../../../middleware/hooks/useAuthentication";
import { useRedirection } from "../../../utils/hooks/useRedirection";

function AuthorizedNavbarNavigation() {
  const redirect = useRedirection();
  const authentication = useAuthentication();

  const logoutUser = () => {
    authentication.logout();
  }

  return (
    <>
      <li onClick={logoutUser}>Logout</li>
    </>
  )
}

export default AuthorizedNavbarNavigation;