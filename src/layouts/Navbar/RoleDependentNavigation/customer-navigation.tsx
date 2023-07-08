import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthentication } from "../../../middleware/hooks/useAuthentication";
import { useRedirection } from "../../../utils/hooks/useRedirection";
import UserHamburgerNavbarComposition from "../user-hamburger-navbar-composition";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import UserShoppingCartComposition from "../user-shopping-cart-composition";

function AuthorizedNavbarNavigation() {
  const redirect = useRedirection();
  const authentication = useAuthentication();

  if (!authentication.user) {
    return (
      <></>
    )
  }

  return (
    <>
      <UserShoppingCartComposition />
      <UserHamburgerNavbarComposition>
        <li onClick={redirect('/products')} className="alt-navbar-option-view">Catalog</li>
        <li onClick={redirect('/products')} className="alt-navbar-option-view">Sell Item</li>
        <li onClick={redirect('/user/orders')}>Orders</li>
        <li onClick={(redirect('/contact'))} className="alt-navbar-option-view">Contact</li>
      </UserHamburgerNavbarComposition>
    </>
  )
}

export default AuthorizedNavbarNavigation;