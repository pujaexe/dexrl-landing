"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet } from "styled-components";

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useServerInsertedHTML(() => {
    const sheet = new ServerStyleSheet();
    const html = sheet.getStyleTags();

    try {
      return <>{html}</>;
    } finally {
      sheet.seal();
    }
  });

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}
