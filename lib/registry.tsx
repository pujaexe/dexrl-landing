"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create the stylesheet only once per render lifecycle.
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // On the client, styled-components manages its own injection.
  if (typeof window !== "undefined") return <>{children}</>;

  // On the server, collect styles into the sheet so they can be flushed into
  // the initial HTML (prevents the flash of unstyled content).
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
