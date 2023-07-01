import { useEffect, useRef, useState } from "react";
import { useAuthentication } from "./useAuthentication";
import md5 from "md5";
import useGravatarAvatar from "./gravatar-avatar-hook";

const useUserGravatarAvatar = (size = 80) => {
  const authentication = useAuthentication();
  return useGravatarAvatar({
    skip: !authentication.user,
    email: authentication.user?.email,
    size: size,
  })
}

export default useUserGravatarAvatar;