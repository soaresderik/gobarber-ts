/** Auth */

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar: any;
}

export interface ISignUp {
  name: string;
  email: string;
  password: string;
  provider?: boolean;
}

export interface AuthState {
  user: IUser | null;
  token: string | null;
  signed: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthAction {
  type: AuthType;
  payload: any;
}

export enum AuthType {
  SIGN_IN = "SIGN_IN",
  SIGN_FAILURE = "SIGN_FAILURE",
  SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS",
  SIGN_UP = "SIGN_UP",
  UPDATE_USER = "UPDATE_USER",
  LOGOUT = "LOGOUT"
}

export interface IUpdateUser {
  name: string;
  email: string;
  oldPassword: string | null;
  avatarId: number | null;
  password: string | null;
}
