// import * as dotenv from "dotenv";
// dotenv.config();
import * as React from "react";
import { HashRouter as Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { GlobalProps } from "./interfaces";
import { ToastContainer } from "react-toastify";
import "./config/ReactotronConfig";

import GlobalStyle from "./styles/globals";

import store from "./store";

import Route from "./Route";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import { signInSuccess } from "./store/auth/auth.actions";
import { IUser } from "./store/interfaces";

const user: IUser | null = localStorage.getItem("profile")
  ? JSON.parse(localStorage.getItem("profile"))
  : null;

if (user) store.dispatch(signInSuccess(user));

const NotFound: React.FC = () => <h1>Página não encontrada!</h1>;
console.log(process.env, process.env.API_URL);
const App: React.FC<GlobalProps> = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={SignIn} />
          <Route path="/register" component={SignUp} />

          <Route path="/dashboard" component={Dashboard} isPrivate />
          <Route path="/profile" component={Profile} isPrivate />
          <Route path="/*" component={NotFound} />
        </Switch>
      </Router>
      <GlobalStyle />
      <ToastContainer autoClose={3000} />
    </Provider>
  );
};

export default App;
