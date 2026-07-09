import { useState } from "react";

export const useClipboard = (resetMs = 1500) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setCopied(value);
      setTimeout(() => setCopied(null), resetMs);
    });
  };

  return { copied, copy };
};
