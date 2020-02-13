import * as React from "react";

import { WrapperAuth } from "./styles";
import Header from "./header.layout";

const AuthLayout: React.FC = ({ children }) => {
  return (
    <WrapperAuth>
      <Header />
      {children}
    </WrapperAuth>
  );
};

export default AuthLayout;
