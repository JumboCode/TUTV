import useSWR, { responseInterface } from 'swr';
import fetch from 'unfetch';

import { useStore } from './store';

interface hookOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: any;
  body?: FormData | Blob | ArrayBuffer | string;
  addTrailingSlash?: boolean;
}

export default function useApi<T>(
  url: string,
  options: hookOptions = {}
): responseInterface<T, undefined> {
  // Get the "base" URL from the store
  const { state } = useStore();
  const base = state && state.apiUrl;

  return useSWR<T>(url, async (path: string) => {
    // Add the path to the base URL
    let { href } = new URL(path, base);
    // Unless addTrailingSlash was explicitly passed as false, we make sure it's there
    if (options.addTrailingSlash !== false && !href.endsWith('/'))
      href = `${href}/`;

    return (
      await fetch(href, {
        ...options,
        headers: { ...options.headers },
      })
    ).json();
  });
}
