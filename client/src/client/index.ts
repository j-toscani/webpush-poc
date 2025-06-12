import { createAuthClient } from "better-auth/react";
type ApiSuccess<T> = {
  error: null;
  data: T;
};

type ApiError = {
  error: string;
  data: null;
};

type ApiResult<T> = ApiError | ApiSuccess<T>;

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL: location.origin, // the base url of your auth server
});
