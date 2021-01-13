import React from "react";

export const IS_MOBILE = window.innerWidth <= 1024;

const IsMobile: React.FC<any> = ({ children }) => (IS_MOBILE ? children : null);

export default IsMobile;
