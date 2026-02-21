import { useEffect, useState } from "react";

export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
      <div
        className="h-full bg-primary transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
