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
      <li onClick={redirect(`/user/cart`)}>Cart</li>
      <li onClick={redirect(`/user/orders`)}>Orders</li>
      <li onClick={logoutUser}>Logout</li>
    </>
  )
}

export default AuthorizedNavbarNavigation;