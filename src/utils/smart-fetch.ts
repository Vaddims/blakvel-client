export async function updateAccessToken() {
  const accessTokenResponse = await fetch('/api/auth/access-token');
  if (!accessTokenResponse.ok) {
    return false;
  }

  const accessToken = await accessTokenResponse.text();
  sessionStorage.setItem('access-token', accessToken);
  return true;
}

async function smartFetch(input: RequestInfo, init?: RequestInit) {
  const headers = new Headers(init?.headers);

  const accessToken = sessionStorage.getItem('access-token');
  if (accessToken) {
    headers.append('Cookie', `ACCESS=${accessToken}`);
  }

  const options: RequestInit = init ?? {};
  options.headers = headers;
  options.redirect = 'follow';

  const response = await fetch(input, options);

  if (response.status === 401) {
    await updateAccessToken();
    return await fetch(input, init);
  }

  return response;
}

export default smartFetch;