import useSWR, { responseInterface } from 'swr';
import jwtDecode from 'jwt-decode';

import { useStore, Action } from './store';

interface DecodedToken {
  token_type: string;
  exp: number;
  user_id: number;
}

/**
 * A react hook to get a valid access token. It will refresh the token if needed.
 * Returns the token if it's possible to get it, otherwise returns undefined.
 */
export async function getAccessToken(
  tokens: { accessToken: string | null; refreshToken: string | null },
  base: string,
  dispatch: React.Dispatch<Action>
): Promise<string | undefined> {
  const { accessToken, refreshToken } = tokens;
  // We can't get a token if we don't have a refresh token or an access token
  if (!accessToken && !refreshToken) return undefined;
  // Return the token if the one we have is not expired
  const decoded: DecodedToken = jwtDecode(accessToken as string);
  if (decoded.exp > Date.now() / 1000) return accessToken as string;
  // If the token is expired, refresh
  const newToken = await apiReq(base, 'token/refresh', {
    // To refresh, we send a POST request with the refresh token
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(({ access: fetchedToken }: { access: string }) => {
      dispatch({
        type: 'login',
        tokens: { access: fetchedToken, refresh: refreshToken as string },
      });
      return fetchedToken;
    })
    .catch((e) => {
      // If we get an error, return undefined and log the user out
      console.error('Error during token refresh:');
      console.log(e);
      dispatch({ type: 'logout' });
      return undefined;
    });
  return newToken;
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: any;
  body?: FormData | Blob | ArrayBuffer | string;
  addTrailingSlash?: boolean;
  token?: string;
}

/**
 * A react hook for connecting a component to API data
 * Automatically implements caching, revalidation, retries, and some other stuff. To make API
 * requests without any of these features, see useApiRequest
 */
export const useApiData = <T>(
  url: string,
  options: ApiRequestOptions = {}
): responseInterface<T, undefined> => {
  // Get the "base" URL from the store
  const { state, dispatch } = useStore();
  const base = state && state.apiUrl;

  return useSWR<T>(url, (path: string) => {
    const tokenPromise = getAccessToken(state.auth, base, dispatch);
    return tokenPromise.then((token) =>
      apiReq(base, path, { token, ...options })
    );
  });
};

/**
 * A react hook for making a raw API request without any fancy logic on top
 */
export const useApiRequest = (
  path: string,
  options: ApiRequestOptions = {}
) => {
  // Get the "base" URL from the store
  const { state, dispatch } = useStore();
  const base = state && state.apiUrl;

  // Return a function that can be called to send the request
  return () => {
    return getAccessToken(state.auth, base, dispatch).then((token) =>
      apiReq(base, path, { token, ...options })
    );
  };
};

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
export const apiReq = (
  base: string,
  path: string,
  options: ApiRequestOptions
) => {
  // Add the path to the base URL
  let { href } = new URL(path, base);
  // Unless addTrailingSlash was explicitly passed as false, we make sure it's there
  if (options.addTrailingSlash !== false && !href.endsWith('/'))
    href = `${href}/`;
  // Add access token if we have it
  if (options.token)
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${options.token}`,
    };

  return fetch(href, options).then(async (r) => {
    const json = await r.json();
    if (r.ok) return json;
    const { status, statusText } = r;
    throw new APIError(statusText, status, json);
  });
};
