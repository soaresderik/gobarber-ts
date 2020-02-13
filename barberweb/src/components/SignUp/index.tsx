import * as React from "react";
import * as Yup from "yup";

import logo from "../../assets/logo2.svg";
import { Link } from "react-router-dom";
import { Form, Input } from "@rocketseat/unform";
import { useDispatch } from "react-redux";
import { ISignUp } from "../../store/interfaces";
import { signUp } from "../../store/auth/auth.actions";
import { GlobalProps } from "../../interfaces";

const schema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),
  email: Yup.string()
    .email("Insira um e-,ail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .min(6, "No mínimo 6 caracteres")
    .required("A senha é obrigatória")
});

const SignUp: React.FC<GlobalProps> = ({ history }) => {
  const dispatch = useDispatch();
  const handleSubmit = async (data: ISignUp) => {
    dispatch(await signUp(data));

    history.push("/");
  };

  return (
    <>
      <img src={logo} alt="GoBarber" />

      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="name" placeholder="Nome completo" />
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />

        <button type="submit">Criar conta</button>
        <Link to="/">Ja tenho login</Link>
      </Form>
    </>
  );
};

export default SignUp;
