import { IAuthenticate } from "../../services/interfaces";
import { AuthType, ISignUp, IUser, IUpdateUser } from "../interfaces";
import { toast } from "react-toastify";
import authService from "../../services/auth.service";
import store from "../index";

export const signIn = async (auth: IAuthenticate) => {
  try {
    const response = await authService.signIn(auth);

    const { token, user } = response.data;
    authService.saveToken(token);

    return signInSuccess(user);
  } catch (err) {
    toast.error(err.response.data.message);
    signFailure();
  }
};

export const signUp = async (data: ISignUp) => {
  try {
    const response = await authService.signUp({ ...data, provider: true });

    return {
      type: AuthType.SIGN_UP,
      payload: response.data
    };
  } catch (err) {
    toast.error(err.response.data.message);
    signFailure();
  }
};

export const signInSuccess = (user: IUser) => {
  const token = authService.loadToken();
  localStorage.setItem("profile", JSON.stringify(user));
  return {
    type: AuthType.SIGN_IN_SUCCESS,
    payload: { token, user }
  };
};

export const signFailure = () => {
  return {
    type: AuthType.SIGN_FAILURE
  };
};

export const loadUser = () => {
  const token = authService.loadToken();

  if (!token || !token.length) return store.dispatch(logout());

  return {
    type: AuthType.SIGN_IN,
    payload: token
  };
};

export const logout = () => {
  authService.removeToken();
  delete localStorage.profile;
  return {
    type: AuthType.LOGOUT
  };
};

export const updateUser = async (data: IUpdateUser) => {
  try {
    const response = await authService.updateUser(data);

    return signInSuccess(response.data);
  } catch (error) {
    toast.error(error.response.data.message);
    signFailure();
  }
};
