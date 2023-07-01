import md5 from "md5";
import { useEffect, useState } from "react";

interface GravatarAvatarHookOptions {
  readonly skip?: boolean;
  readonly email?: string;
  readonly size?: number;
}

const useGravatarAvatar = (options: GravatarAvatarHookOptions) => {
  const [ imageSource, setImageSource ] = useState<string | null>(null);
  const [ isLoading, setLoading ] = useState(true);
  const [ isError, setError ] = useState(false);
  const [ isSuccess, setSuccess ] = useState(false);
  
  useEffect(() => {
    if (!options.email) {
      return;
    }

    if (options.skip) {
      setLoading(false);
      return;
    }

    const formattedSize = 'size' in options ? `s=${options.size}&` : '';
    const url = `http://www.gravatar.com/avatar/${md5(options.email)}.jpg?${formattedSize}d=404`;

    const img = new Image();
    img.onload = () => {
      if (!options.email) {
        return;
      }

      setImageSource(url);
      setLoading(false);
      setSuccess(true);
    };

    img.onerror = () => {
      setImageSource(null);
      setLoading(false);
      setError(true);
    };

    img.src = url;
  }, [options.skip, options.email]);

  return {
    data: imageSource,
    isLoading,
    isSuccess,
    isError,
  }
}

export default useGravatarAvatar;