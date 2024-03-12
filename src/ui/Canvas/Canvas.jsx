import React, { useEffect, useState } from "react";
import { Stage, Layer, Circle, Rect } from "react-konva";

const Canvass = () => {
  const [stagePos, setStagePos] = useState({ x: 2500, y: 2500 });
  const [keyPressed, setKeyPressed] = useState({});
  
  // путем проб и ошибок пришел к такому назначению событий
  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeyPressed((prev) => ({ ...prev, [event.key]: true }));
    };

    const handleKeyUp = (event) => {
      setKeyPressed((prev) => ({ ...prev, [event.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return;
  }, []);

  // бинды на кнопки
  useEffect(() => {
    const moveStage = () => {
      if (keyPressed["w"]) {
        setStagePos((prevPos) => ({ ...prevPos, y: prevPos.y - 5 }));
      }
      if (keyPressed["a"]) {
        setStagePos((prevPos) => ({ ...prevPos, x: prevPos.x - 5 }));
      }
      if (keyPressed["s"]) {
        setStagePos((prevPos) => ({ ...prevPos, y: prevPos.y + 5 }));
      }
      if (keyPressed["d"]) {
        setStagePos((prevPos) => ({ ...prevPos, x: prevPos.x + 5 }));
      }
    };

    moveStage();

    return;
  }, [keyPressed]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        touchAction: "pan-y",
        overflow: "hidden",
      }}
    >
      {/* это точка в центре экрана (хз зачем) */}
      <div
        style={{
          position: "absolute",
          width: "5px",
          height: "5px",
          left: "50%",
          top: "50%",
          backgroundColor: "black",
        }}
      ></div>
      {/* это фейк сетка, потом надо заменить */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundSize: "500px",
          backgroundImage: "url(/grid.png)",
          backgroundRepeat: "repeat",
        }}
      ></div>
      {/* Stage - это канва */}
      <Stage x={-2500} y={-2500} width={5000} height={5000}>
        {/* Layer - это группа, которая двигается по клавишам WASD */}
        <Layer x={stagePos.x} y={stagePos.y}>
          {/* Rect - это шляпа (полная) */}
          <Rect x={0} y={0} width={5000} height={5000} />
          {/* Circle - это кружочек, который видно на экране со старта для теста движения Layer */}
          <Circle x={0} y={0} stroke="black" radius={20} fill="black" />
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvass;