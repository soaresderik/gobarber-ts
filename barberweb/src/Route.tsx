import * as React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import store from "./store";

import DefaultLayout from "./components/_layouts/default.layout";
import AuthLayout from "./components/_layouts/auth.layout";

type LayoutRouteProps = RouteProps & {
  component: React.ComponentType;
  isPrivate?: boolean;
};

const RouteWrapper = ({ component, isPrivate, ...rest }: LayoutRouteProps) => {
  const Component = component;
  // const auth = useSelector((state: any) => state.auth) as AuthState;
  const { signed } = store.getState().auth;

  if (!signed && isPrivate) return <Redirect to="/" />;

  if (signed && !isPrivate) return <Redirect to="/dashboard" />;

  const Layout = signed ? DefaultLayout : AuthLayout;

  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

export default RouteWrapper;
