import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface CachedParamState {
  [key: string]: null | string | string[];
}

interface ParamState {
  [key: string]: ParamStateController;
}

interface ParamStateController {
  all: string[];
  value: string | null;
  set: (value: string[] | string | null) => ParamStateController;
  remove: () => ParamStateController;
  apply: () => void;
}

const useSearchParamState = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation()
  const [ urlSearchParams ] = useSearchParams();
  const [ shouldApplyParams, setShouldApplyParams ] = useState(false);

  const instantiateCachedParams = () => {
    const cachedParams: CachedParamState = {};

    for (const [ key, value ] of urlSearchParams.entries()) {
      if (key in cachedParams) {
        const cachedValue = cachedParams[key];
        if (Array.isArray(cachedValue)) {
          cachedValue.push(value);
        } else if (cachedValue !== null) {
          cachedParams[key] = [cachedValue, value];
        }
      } else {
        cachedParams[key] = value;
      }
    }

    return cachedParams;
  }

  const [ cachedParams, setCachedParams ] = useState<CachedParamState>(instantiateCachedParams());
  
  let awaitingStateResolution = false;

  const updateCachedParams = (key: string, value: null | string | string[]) => {
    awaitingStateResolution = true;
    setCachedParams((state) => ({
      ...state,
      [key]: value,
    }))

    return createReturnObject(key);
  }

  const getComposedSearchParams = () => {
    const newSearchParams = new URLSearchParams();
    for (const key in cachedParams) {
      const value = cachedParams[key];
      if (value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const element of value) {
          newSearchParams.append(key, element);
        }
        continue;
      }

      if (value.trim() === '') {
        continue;
      }
      
      newSearchParams.set(key, value);
    }

    return newSearchParams;
  }

  useEffect(() => {
    if (shouldApplyParams && !awaitingStateResolution) {
      const urlSearchParams = getComposedSearchParams();
      const searchParams = urlSearchParams.toString();
      if (searchParams.length === 0) {
        navigate(pathname)
        return; 
      }
  
      navigate(`${pathname}?${searchParams}`);
    }
  }, [shouldApplyParams, cachedParams]);

  useEffect(() => {
    setCachedParams(instantiateCachedParams());
  }, [urlSearchParams.toString()]);

  const applySearchParams = () => {
    setShouldApplyParams(true);
  }

  const asArr = (key: string): string[] => {
    const data = cachedParams[key];

    if (data === null) {
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [data];
  }

  const createReturnObject = (key: string): ParamStateController => ({
    all: asArr(key),
    value: asArr(key)[0] ?? null,
    apply: () => applySearchParams(),
    set: (value: string[] | string | null) => updateCachedParams(key, value),
    remove: () => updateCachedParams(key, null),
  });

  const paramCluster = new Proxy<ParamState>({}, {
    get: (target, key: string): ParamStateController => {
      if (!(key in cachedParams)) {
        updateCachedParams(key, null);
      }

      return createReturnObject(key);
    }
  });

  const clearCachedParams = () => {
    setCachedParams({});
  }

  return {
    urlSearchParams,
    paramCluster,
    clear: clearCachedParams,
    applySearchCluster: () => applySearchParams(),
  }
}

export default useSearchParamState;