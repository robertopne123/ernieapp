import { useCookies } from "react-cookie";

const TOKEN_NAME = "authToken";

export const useAuthToken = () => {
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_NAME]);

  const setAuthToken = (authToken) => {
    console.log(authToken);
    setCookie(TOKEN_NAME, authToken);
  };

  const removeAuthToken = () => removeCookie(TOKEN_NAME);

  return [cookies[TOKEN_NAME], setAuthToken, removeAuthToken];
};