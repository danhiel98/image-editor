import { useState, useEffect } from "react";

function getWindowDimensions() {
  let width, height;
  if (process.browser) {
    const { innerWidth: w, innerHeight: h } = window;
    width = w;
    height = h;
  }

  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
