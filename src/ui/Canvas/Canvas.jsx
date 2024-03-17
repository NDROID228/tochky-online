import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Line, Circle, Group } from "react-konva";
import map from "../../store/mapStore";

const GRID_SIZE = 75; // Размер ячейки сетки
const CANVAS_SIZE = 5000; // Размер канваса
const STEP = 3; // Шаг движения

const Canvass = ({ isOpen }) => {
  const mapSettings = map();
  const [stagePos, setStagePos] = useState({
    x: CANVAS_SIZE / 2,
    y: CANVAS_SIZE / 2,
  });
  const [keyPressed, setKeyPressed] = useState({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!event.repeat) {
        setKeyPressed((prev) => ({ ...prev, [event.key]: true }));
      }
    };

    const handleKeyUp = (event) => {
      setKeyPressed((prev) => ({ ...prev, [event.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (isOpen) return;
    const moveStage = () => {
      let deltaX = 0;
      let deltaY = 0;
      const numKeysPressed = Object.values(keyPressed).filter(
        (val) => val
      ).length;
      if (keyPressed["w"]) {
        deltaY = -STEP;
      }
      if (keyPressed["a"]) {
        deltaX = -STEP;
      }
      if (keyPressed["s"]) {
        deltaY = STEP;
      }
      if (keyPressed["d"]) {
        deltaX = STEP;
      }
      if (numKeysPressed === 2) {
        deltaX /= 1.4;
        deltaY /= 1.4;
      }
      if (deltaX !== 0 || deltaY !== 0) {
        setStagePos((prevPos) => {
          const newPos = { x: prevPos.x + deltaX, y: prevPos.y + deltaY };
          // Ограничиваем движение, чтобы сцена не выходила за пределы канваса
          newPos.x = Math.max(0, Math.min(CANVAS_SIZE, newPos.x));
          newPos.y = Math.max(0, Math.min(CANVAS_SIZE, newPos.y));

          console.log(newPos);
          return newPos;
        });
      }
    };
    moveStage();
  }, [keyPressed, stagePos.y, stagePos.x, mapSettings]);

  const renderGrid = () => {
    const lines = [];
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      lines.push(
        <Line
          key={`line-x-${i}`}
          points={[
            i - stagePos.x,
            0 - stagePos.y,
            i - stagePos.x,
            CANVAS_SIZE - stagePos.y,
          ]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
      lines.push(
        <Line
          key={`line-y-${i}`}
          points={[
            0 - stagePos.x,
            i - stagePos.y,
            CANVAS_SIZE - stagePos.x,
            i - stagePos.y,
          ]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    return lines;
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        // touchAction: "pan-y",
        overflow: "hidden",
      }}
    >
      <Stage x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            fill="#fff"
          />

          
          {renderGrid()}
          <Circle
            x={window.innerWidth/2} 
            y={window.innerHeight/2}
            radius={50} // Радиус кружка
            fill="red"
          />
        </Layer>
      </Stage>
      {/* <Stage x={0} y={0} width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={500}
            height={500}
            fill="black"
          />

          <Circle
            x={2} 
            y={2}
            radius={500} // Радиус кружка
            fill="red"
          />
          {renderGrid()}
        </Layer>
      </Stage> */}
    </div>
  );
};

export default Canvass;
