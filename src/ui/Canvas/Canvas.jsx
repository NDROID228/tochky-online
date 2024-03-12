import React, { useEffect, useState, useLayoutEffect } from "react";
import { Stage } from "react-konva";

const Map = () => {
  const [windowSize, setWindowSize] = useState({width: window.innerWidth, height: window.innerHeight});

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  useEffect(() => {
    
  }, [])
  
  return <Stage width={windowSize.width} height={windowSize.height}>

  </Stage>;
};

export default Map;
