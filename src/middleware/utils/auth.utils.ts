export const requestAccessToken = async () => {
  const response = await fetch('/api/auth/access-token');
  return response.ok;
}

