import useSWR, { responseInterface } from 'swr';
import fetch from 'unfetch';

import { useStore } from './store';

interface fetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: any;
  body?: FormData | Blob | ArrayBuffer | string;
}

export default function useApi<T>(
  url: string,
  options: fetchOptions = {}
): responseInterface<T, undefined> {
  // Get the "base" URL from the store
  const { state } = useStore();
  const base = state && state.apiUrl;

  return useSWR<T>(url, async (url: string) => {
    const { href } = new URL(url, base);
    console.log('fetching', href);
    return (
      await fetch(href, {
        ...options,
        headers: { ...options.headers },
      })
    ).json();
  });
}
