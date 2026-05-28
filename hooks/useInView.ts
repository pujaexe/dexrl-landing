"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Use layoutEffect in browser so above-fold elements are immediately visible
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useInView(rootMargin = "-72px") {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If element is already in the viewport on mount → reveal instantly (no flash)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true);
      return;
    }

    // Otherwise watch for it scrolling into view
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: `0px 0px ${rootMargin} 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
