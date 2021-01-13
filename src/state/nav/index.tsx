import React, { useState } from "react";

const initialState = {
  visible: true,
  toggleVisible: () => null,
};

export const NavContext = React.createContext(initialState);
export const NavConsumer = NavContext.Consumer;
export const NavProvider: React.FC<any> = ({ children }) => {
  const [visible, updateVisible] = useState<boolean>(true);

  const toggleVisible = () => updateVisible(!visible);

  const state = { toggleVisible, visible };

  return <NavContext.Provider value={state}>{children}</NavContext.Provider>;
};
