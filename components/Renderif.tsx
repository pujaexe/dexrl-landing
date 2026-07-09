import React from "react";

const RenderIf: React.FC<{ isTrue: boolean, children: React.ReactNode }> = ({ isTrue, children }) => {
    if (!isTrue) return null;
    return children;
};

export default RenderIf;