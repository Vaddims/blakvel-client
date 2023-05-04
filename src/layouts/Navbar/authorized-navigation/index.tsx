import { useAuthentication } from "../../../middleware/hooks/useAuthentication";
import { useRedirection } from "../../../utils/hooks/useRedirection";

function AuthorizedNavbarNavigation() {
  const redirect = useRedirection();
  const authentication = useAuthentication();

  const logoutUser = () => {
    authentication.logout();
  }

  if (!authentication.user) {
    return (
      <></>
    )
  }

  return (
    <>
      <li onClick={redirect(`/users/${authentication.user.id}/cart`)}>Cart</li>
      <li onClick={logoutUser}>Logout</li>
    </>
  )
}

export default AuthorizedNavbarNavigation;