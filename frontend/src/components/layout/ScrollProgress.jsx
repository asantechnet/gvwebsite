import { useEffect, useRef, useState } from "react";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const animationFrame = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      animationFrame.current = null;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        scrollableHeight > 0
          ? Math.min(window.scrollY / scrollableHeight, 1)
          : 0;

      setProgress(nextProgress);
    };

    const requestProgressUpdate = () => {
      if (animationFrame.current !== null) return;
      animationFrame.current = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);

    return () => {
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
    >
      <div
        className="h-full origin-right rounded-full bg-primary transition-transform duration-100 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

export default ScrollProgress;
