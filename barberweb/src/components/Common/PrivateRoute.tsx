import * as React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AuthState } from "../../store/interfaces";
import { useSelector } from "react-redux";

import DefaultLayout from "../_layouts/default.layout";
import AuthLayout from "../_layouts/auth.layout";

type LayoutRouteProps = RouteProps & {
  component: React.ComponentType;
};

const PrivateRoute = ({ component, ...rest }: LayoutRouteProps) => {
  const Component = component;
  // const auth = useSelector((state: any) => state.auth) as AuthState;
  const isAuthenticated = false;

  const Layout = isAuthenticated ? DefaultLayout : AuthLayout;
  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? (
          <Redirect to="/" />
        ) : (
          <Layout>
            <Component {...props} />
          </Layout>
        )
      }
    />
  );
};

export default PrivateRoute;
