function clientFetch(input: RequestInfo, init?: RequestInit) {
  return fetch(input, init);
}

export default clientFetch;