import { useRedirection } from "../../../utils/hooks/useRedirection";
import UserHamburgerNavbarComposition from "../user-hamburger-navbar-composition";

function UnauthorizedNavbarNavigation() {
  const redirect = useRedirection();

  return (
    <>
      <li onClick={redirect('/auth/login')}>Sign Up</li>
      <UserHamburgerNavbarComposition>
        <li onClick={redirect('/products')} className="alt-navbar-option-view">Products</li>
        <li onClick={(redirect('/contact'))} className="alt-navbar-option-view">Contact</li>
      </UserHamburgerNavbarComposition>
    </>
  )
}

export default UnauthorizedNavbarNavigation;