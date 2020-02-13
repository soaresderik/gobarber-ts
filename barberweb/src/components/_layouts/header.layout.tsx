import * as React from "react";
import { HeaderContainer, HeaderContent, Profile } from "./styles";

import logo from "../../assets/logo1.svg";
import { Link } from "react-router-dom";
import Notifications from "./notifications.layout";
import { useSelector } from "../../store";

const Header = () => {
  const profile = useSelector(state => state.auth.user);
  return (
    <HeaderContainer>
      <HeaderContent>
        <nav>
          <img src={logo} alt="GoBarber" />
          <Link to="/dashboard">DASHBOARD</Link>
        </nav>

        <aside>
          <Notifications />
          <Profile>
            <div>
              <strong>André Soares</strong>
              <Link to="/profile">Meu Perfil</Link>
            </div>
            <img
              src={
                profile?.avatar?.url ||
                "https://api.adorable.io/avatars/50/abott@adorable.png"
              }
              alt="André Soares"
            />
          </Profile>
        </aside>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
