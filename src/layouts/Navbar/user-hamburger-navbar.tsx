import { useEffect, useRef, useState } from "react";
import { useRedirection } from "../../utils/hooks/useRedirection";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import md5 from "md5";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUserGravatarAvatar from "../../middleware/hooks/user-gravatar-avatar-hook";

interface UserHamburgerNavbarProps {
  dialogRef?: React.RefObject<HTMLDialogElement>;
}

const UserHamburgerNavbar: React.FC<UserHamburgerNavbarProps> = (props) => {
  const authentication = useAuthentication();
  const redirect = useRedirection();

  const { data: gravatarAvatarSource } = useUserGravatarAvatar();


  const logoutUser = () => {
    authentication.logout();
  }

  const userNavigationOptionClickHandler = () => {
    const dialogElement = props.dialogRef?.current as any;
    dialogElement?.close();
  }

  return (
    <div className="user-dialog-container">
      <dialog className="user-dialog" ref={props.dialogRef}>
        <div className="dialog-content">
          { authentication.user && (
            <div className="user-info-container">
              <div className='user-appearance' data-offline-icon={!gravatarAvatarSource}>
                { gravatarAvatarSource ? (
                  <img src={`http://www.gravatar.com/avatar/${md5(authentication.user.email)}.jpg?s=${80}`} alt="" />
                ) : (
                  <div>
                    <FontAwesomeIcon icon={faUser} size='xl' />
                  </div>
                ) }
              </div>
              <div className='user-info'>
                <h3>{authentication.user.role}</h3>
                <p>{authentication.user.email}</p>
              </div>
            </div>
          )}
          <ul className='user-navigations' onClick={userNavigationOptionClickHandler}>
            {props.children}
            { authentication.user ? (
              <li onClick={logoutUser} className="logout-button">Logout</li>
            ) : (
              <li className="login-action" onClick={redirect('/auth/login')}>Sign Up</li>
            ) }
          </ul>
        </div>
      </dialog>
    </div>
  );
}

export default UserHamburgerNavbar;