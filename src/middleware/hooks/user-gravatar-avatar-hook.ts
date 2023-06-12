import { useEffect, useRef, useState } from "react";
import { useAuthentication } from "./useAuthentication";
import md5 from "md5";

const useUserGravatarAvatar = () => {
  const authentication = useAuthentication();

  const [ imageSource, setImageSource ] = useState<string | null>(null);
  const [ isLoading, setLoading ] = useState(true);
  const [ isError, setError ] = useState(false);
  const [ isSuccess, setSuccess ] = useState(false);
  
  useEffect(() => {
    if (!authentication.user) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (!authentication.user) {
        return;
      }

      setImageSource(`http://www.gravatar.com/avatar/${md5(authentication.user?.email)}.jpg?s=${80}&d=404`);
      setLoading(false);
      setSuccess(true);
    };

    img.onerror = () => {
      setImageSource(null);
      setLoading(false);
      setError(true);
    };

    img.src = `http://www.gravatar.com/avatar/${md5(authentication.user?.email)}.jpg?s=${80}&d=404`;
  }, []);

  return {
    data: imageSource,
    isLoading,
    isSuccess,
    isError,
  }
}

export default useUserGravatarAvatar;