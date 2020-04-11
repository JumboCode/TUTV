import useSWR, { responseInterface } from 'swr';
import fetch from 'unfetch';

import { useStore } from './store';

interface apiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: any;
  body?: FormData | Blob | ArrayBuffer | string;
  addTrailingSlash?: boolean;
}

/**
 * A react hook for connecting a component to API data
 * Automatically implements caching, revalidation, retries, and some other stuff. To make API
 * requests without any of these features, see useRequest
 */
export function useApiData<T>(
  url: string,
  options: apiRequestOptions = {}
): responseInterface<T, undefined> {
  // Get the "base" URL from the store
  const { state } = useStore();
  const base = state && state.apiUrl;

  return useSWR<T>(url, (path: string) => apiReq(base, path, options));
}

/**
 * A react hook for making a raw API request without any fancy logic on top
 */
export function useRequest(path: string, options: apiRequestOptions = {}) {
  // Get the "base" URL from the store
  const { state } = useStore();
  const base = state && state.apiUrl;
  // Return a function that can be called to send the request
  return () => apiReq(base, path, options);
}

/**
 * Make a request to the API
 * @param base - the base URL (for example: https://localhost:8000/api/v1/)
 * @param path - the path after that URL (for example: 'token')
 * @param options - options to apply to the fetch request
 */
export async function apiReq(
  base: string,
  path: string,
  options: apiRequestOptions
) {
  // Add the path to the base URL
  let { href } = new URL(path, base);
  // Unless addTrailingSlash was explicitly passed as false, we make sure it's there
  if (options.addTrailingSlash !== false && !href.endsWith('/'))
    href = `${href}/`;

  return (await fetch(href, options)).json();
}
