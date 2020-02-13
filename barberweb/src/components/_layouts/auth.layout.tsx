import * as React from "react";

import { WrapperDefault, Content } from "./styles";

const DefaultLayout: React.FC = ({ children }) => {
  return (
    <WrapperDefault>
      <Content>{children}</Content>
    </WrapperDefault>
  );
};

export default DefaultLayout;
