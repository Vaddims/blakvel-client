import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserHamburgerNavbar from "./user-hamburger-navbar";
import { faBars, faHamburger, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";
import useUserGravatarAvatar from "../../middleware/hooks/user-gravatar-avatar-hook";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";

const UserHamburgerNavbarComposition: React.FC = (props) => {
  const userNavigationRef = useRef<HTMLDialogElement>(null);
  const { user } = useAuthentication();
  const { data: gravatarAvatarSource } = useUserGravatarAvatar();

  const openUseravigationModalHandler: React.MouseEventHandler<HTMLDivElement> = () => {
    const dialogElement = userNavigationRef.current as any;
    if (!dialogElement) {
      return;
    }

    if (dialogElement.open) {
      dialogElement.close();
    } else {
      dialogElement.show();
    }
  }

  useEffect(() => {
    const handler = () => {
      const dialogElement = userNavigationRef.current as any;
      if (!dialogElement) {
        return;
      }

      dialogElement.close();
    }

    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler);
    }
  })

  const ren = () => {
    if (!user) {
      return (<FontAwesomeIcon icon={faBars} size='lg' />)
    }

    if (gravatarAvatarSource) {
      return (<img src={gravatarAvatarSource} alt="" />)
    }

    return (<FontAwesomeIcon icon={faUser} size="lg" />);
  }

  return (
    <li className="user-navbar-composition" onClick={(e) => e.stopPropagation()} data-show-composition={!!user}>
      <div className="user-navbar" data-offline-icon={!gravatarAvatarSource} onClick={openUseravigationModalHandler}>
        {ren()}
      </div>
      <UserHamburgerNavbar dialogRef={userNavigationRef}>
        {props.children}
      </UserHamburgerNavbar>
    </li>
  )
}

export default UserHamburgerNavbarComposition;