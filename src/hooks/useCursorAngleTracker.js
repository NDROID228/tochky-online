import { useState, useEffect } from "react";

const useCursorAngleTracker = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const updateCursorPosition = (event) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      setCursorPosition({ x: mouseX, y: mouseY });

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const radians = Math.atan2(-dy, dx);
      const angle =
        radians >= 0
          ? radians * (180 / Math.PI)
          : (2 * Math.PI + radians) * (180 / Math.PI);

      setAngle(angle);
    };

    window.addEventListener("mousemove", updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
    };
  }, []);

  return { angle, cursorPosition };
};

export default useCursorAngleTracker;
