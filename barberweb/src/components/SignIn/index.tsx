import * as React from "react";
import * as Yup from "yup";
import { Form, Input } from "@rocketseat/unform";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import logo from "../../assets/logo2.svg";
import { signIn } from "../../store/auth/auth.actions";
import { GlobalProps } from "../../interfaces";
import { AuthState } from "../../store/interfaces";
import { useSelector } from "../../store";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Insira um e-,ail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string().required("A senha é obrigatória")
});

const SignIn: React.FC<GlobalProps> = ({ history }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  const handleSubmit = async ({ email, password }: any) => {
    dispatch(await signIn({ email, password }));

    history.push("/dashboard");
  };

  return (
    <>
      <img src={logo} alt="GoBarber" />

      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />

        <button type="submit">{loading ? "Carregando..." : "Acessar"}</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  );
};

export default SignIn;
