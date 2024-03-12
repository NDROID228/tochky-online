import React, { useEffect, useState, useLayoutEffect } from "react";
import { Stage, Layer, Circle, Line } from "react-konva";
// import getWindowSize from "../../usefulFunctions/getWindowSize";

const Canvas = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Stage width={windowSize.width} height={windowSize.height}>
        {/* DO NOT UNCOMMENT THIS SHIT!!1! */}
        {/* <Layer x={windowSize.width / 2} y={windowSize.height / 2}>
          <Circle x={200} y={200} stroke="black" radius={20} />
          <Circle x={240} y={200} stroke="black" radius={20} />
          <Line points={[200, 180, 200, 100]} stroke={"black"} />
          <Line points={[240, 180, 240, 100]} stroke={"black"} />
          <Circle x={220} y={100} stroke="black" radius={20} />
          <Line points={[220, 80, 220, 100]} stroke={"black"} />
        </Layer> */}
      </Stage>
    </div>
  );
};

export default Canvas;
