import * as React from "react";
import { Container } from "./styles";
import { Form, Input } from "@rocketseat/unform";
import { useSelector } from "../../store";
import { IUpdateUser } from "../../store/interfaces";
import { useDispatch } from "react-redux";
import { updateUser, logout } from "../../store/auth/auth.actions";
import { toast } from "react-toastify";
import Avatar from "./Avatar";
import { GlobalProps } from "../../interfaces";

const Profile: React.FC<GlobalProps> = ({ history }) => {
  const dispatch = useDispatch();
  const profle = useSelector(state => state.auth.user);

  async function handleSubmit(data: IUpdateUser) {
    data = {
      ...data,
      avatarId: +data.avatarId || null,
      oldPassword: data.oldPassword === "" ? null : data.oldPassword,
      password: data.password === "" ? null : data.password
    };

    dispatch(await updateUser(data));
    toast.success("Perfil atualizado com sucesso!");
  }

  function handleSignout() {
    dispatch(logout());
    history.push("/");
  }
  return (
    <Container>
      <Form onSubmit={handleSubmit} initialData={profle}>
        <Avatar name="avatarId" />
        <Input name="name" placeholder="Nome completo" />
        <Input name="email" type="email" placeholder="Seu endereço de e-mail" />

        <hr />

        <Input
          type="password"
          name="oldPassword"
          placeholder="Sua senha atual"
        />
        <Input type="password" name="password" placeholder="Sua nova senha" />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirmação de senha"
        />

        <button type="submit">Atualizar perfil</button>
      </Form>
      <button type="button" onClick={handleSignout}>
        Sair do GoBarber
      </button>
    </Container>
  );
};

export default Profile;
