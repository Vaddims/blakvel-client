import { useRedirection } from "../../../utils/hooks/useRedirection";
import UserHamburgerNavbarComposition from "../user-hamburger-navbar-composition";

function UnauthorizedNavbarNavigation() {
  const redirect = useRedirection();

  return (
    <>
      <li className="login-action" onClick={redirect('/auth/login')}>Sign Up</li>
      <UserHamburgerNavbarComposition>
        <li onClick={redirect('/products')} className="alt-navbar-option-view">Catalog</li>
        <li onClick={redirect('/products')} className="alt-navbar-option-view">Sell Item</li>
        <li onClick={(redirect('/contact'))} className="alt-navbar-option-view">Contact Us</li>
      </UserHamburgerNavbarComposition>
    </>
  )
}

export default UnauthorizedNavbarNavigation;