import { combineReducers, createStore, compose } from "redux";
import { useSelector as IUseSelector, TypedUseSelectorHook } from "react-redux";

import authStore from "./auth/auth.store";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const actions = combineReducers({
  auth: authStore
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(actions, composeEnhancers());

type RootType = ReturnType<typeof actions>;
export const useSelector: TypedUseSelectorHook<RootType> = IUseSelector;

export default store;
