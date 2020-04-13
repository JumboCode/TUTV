import useSWR, { responseInterface } from 'swr';
import fetch from 'unfetch';

import { useStore } from './store';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: any;
  body?: FormData | Blob | ArrayBuffer | string;
  addTrailingSlash?: boolean;
}

/**
 * A react hook for connecting a component to API data
 * Automatically implements caching, revalidation, retries, and some other stuff. To make API
 * requests without any of these features, see useApiRequest
 */
export function useApiData<T>(
  url: string,
  options: ApiRequestOptions = {}
): responseInterface<T, undefined> {
  // Get the "base" URL from the store
  const { state } = useStore();
  const base = state && state.apiUrl;

  return useSWR<T>(url, (path: string) => apiReq(base, path, options));
}

/**
 * A react hook for making a raw API request without any fancy logic on top
 */
export function useApiRequest(path: string, options: ApiRequestOptions = {}) {
  // Get the "base" URL from the store
  const { state } = useStore();
  const base = state && state.apiUrl;
  // Return a function that can be called to send the request
  return () => apiReq(base, path, options);
}

class APIError extends Error {
  status: number;
  response: object;

  constructor(message: string, status: number, response: object) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

/**
 * Make a request to the API
 * @param base - the base URL (for example: https://localhost:8000/api/v1/)
 * @param path - the path after that URL (for example: 'token')
 * @param options - options to apply to the fetch request
 */
export function apiReq(base: string, path: string, options: ApiRequestOptions) {
  // Add the path to the base URL
  let { href } = new URL(path, base);
  // Unless addTrailingSlash was explicitly passed as false, we make sure it's there
  if (options.addTrailingSlash !== false && !href.endsWith('/'))
    href = `${href}/`;

  return fetch(href, options).then(async (r) => {
    const json = await r.json();
    if (r.ok) return json;
    const { status, statusText } = r;
    throw new APIError(statusText, status, json);
  });
}
