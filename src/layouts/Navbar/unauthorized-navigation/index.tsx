import { useRedirection } from "../../../utils/hooks/useRedirection";

function UnauthorizedNavbarNavigation() {
  const redirect = useRedirection();

  return (
    <>
      <li onClick={redirect('/auth/login')}> 
        Login
      </li>
    </>
  )
}

export default UnauthorizedNavbarNavigation;