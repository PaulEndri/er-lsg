import React from "react";

export const IS_DESKTOP = window.innerWidth > 1024;

const IsDesktop: React.FC<any> = ({ children }) => (IS_DESKTOP ? children : null);

export default IsDesktop;
