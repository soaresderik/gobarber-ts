import { AuthState, AuthType, AuthAction } from "../interfaces";

const initialState: AuthState = {
  user: null,
  token: null,
  signed: false,
  loading: false,
  error: null
};

const authStore = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthType.SIGN_IN:
    case AuthType.SIGN_IN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        signed: true,
        loading: true
      };
    case AuthType.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        signed: false
      };
    default:
      return state;
  }
};

export default authStore;
