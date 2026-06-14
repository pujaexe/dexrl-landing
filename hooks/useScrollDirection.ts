import { useState, useEffect } from "react";

export type ScrollDirection = "up" | "down";

const useScrollDirection = (
  threshold = 10
): {
  scrollDirection: ScrollDirection;
  currentScrollY: number;
  lastScrollY: number;
} => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentScrollY, setCurrentScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setCurrentScrollY(currentScrollY);

      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return;
      }

      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, threshold]);

  return { scrollDirection, lastScrollY, currentScrollY };
};

export default useScrollDirection;
