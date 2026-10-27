import { useEffect, useRef, useState } from "react";

export function useCopyText(value: string) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function copy() {
    clearTimeout(resetTimer.current);
    setError(false);
    setCopied(false);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
    }
  }

  return { copy, copied, error };
}
