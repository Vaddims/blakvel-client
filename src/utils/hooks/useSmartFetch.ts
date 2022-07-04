import { ApiEndpoints } from "../api-endpoints.enum";

export interface UseSmartFetchOptions {
  preventAuthorization?: boolean;
  preventLoginRedirection?: boolean;
}

export function useSmartFetch(options?: UseSmartFetchOptions) {
  const contentTypeHeaderName = 'Content-Type';
  const unauthorizedStatusCode = 401;

  return async function smartFetch(input: RequestInfo, init?: RequestInit) {
    const headers = new Headers(init?.headers);
    headers.set(contentTypeHeaderName, headers.get(contentTypeHeaderName) ?? 'application/json');

    const requestInit: RequestInit = {
      ...init, 
      headers,
    }

    const fetchSource = async () => await fetch(input, requestInit);
    const sourceResponse = await fetchSource();

    if (sourceResponse.status !== unauthorizedStatusCode || options?.preventAuthorization) {
      return sourceResponse;
    }

    const accessUpdateResponse = await fetch(ApiEndpoints.accessUpdate);
    if (accessUpdateResponse.status !== unauthorizedStatusCode || options?.preventLoginRedirection) {
      return await fetchSource();
    }
    
    return sourceResponse;
  }
}