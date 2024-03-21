import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Line, Circle, Group } from "react-konva";
import map from "../../store/mapStore";
import useCursorAngleTracker from "../../hooks/useCursorAngleTracker";

const GRID_SIZE = 150; // Размер ячейки сетки
const CANVAS_SIZE = 3000; // Размер канваса
const STEP = 3; // Шаг движения

const Canvass = ({ isOpen, sendJsonMessage, lastJsonMessage }) => {
  const mapSettings = map();
  const radius = 50 * 1.5;

  const { angle } = useCursorAngleTracker();

  const [stagePos, setStagePos] = useState({
    x: CANVAS_SIZE / 2,
    y: CANVAS_SIZE / 2,
  });
  const [keyPressed, setKeyPressed] = useState({});
  const [handPos, setHandPos] = useState({
    firstHand: { x: -50, y: -50 },
    secondHand: { x: -50, y: 50 },
  });

  const calculateCoordinates = (angle) => {
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  const updateHandPosition = (angle) => {
    const firstHandPos = calculateCoordinates(-angle + 45);
    const secondHandPos = calculateCoordinates(-angle - 45); // Размещаем вторую руку на противоположной стороне
    setHandPos({ firstHand: firstHandPos, secondHand: secondHandPos });
  };

  useEffect(() => {
    updateHandPosition(angle);
  }, [angle]);

  useEffect(() => {
    const handleClickDown = (event) => {
      if (!event.repeat) {
        if (event.type === "mousedown") {
          const button =
            event.button == 0 ? "leftMouseButton" : "rightMouseButton";
          setKeyPressed((prev) => ({ ...prev, [button]: false }));
          sendJsonMessage({
            type: "keyEvent",
            body: { key: button, eventType: "keyup" },
          });
        } else {
          setKeyPressed((prev) => ({ ...prev, [event.key]: true }));
          sendJsonMessage({
            type: "keyEvent",
            body: { key: event.key, eventType: "keydown" },
          });
        }
      }
    };

    const handleClickUp = (event) => {
      if (event.type === "mouseup") {
        const button =
          event.button == 0 ? "leftMouseButton" : "rightMouseButton";
        // console.log(button);
        setKeyPressed((prev) => ({ ...prev, [button]: false }));
        sendJsonMessage({
          type: "keyEvent",
          body: { key: button, eventType: "keyup" },
        });
      } else {
        setKeyPressed((prev) => ({ ...prev, [event.key]: false }));
        sendJsonMessage({
          type: "keyEvent",
          body: { key: event.key, eventType: "keyup" },
        });
      }
    };

    window.addEventListener("keydown", handleClickDown);
    window.addEventListener("keyup", handleClickUp);
    window.addEventListener("mousedown", handleClickDown);
    window.addEventListener("mouseup", handleClickUp);

    return () => {
      window.removeEventListener("keydown", handleClickDown);
      window.removeEventListener("keyup", handleClickUp);
      window.removeEventListener("mousedown", handleClickDown);
      window.removeEventListener("mouseup", handleClickUp);
    };
  }, []);

  // функція анімації блоку
  const blockUpCalc = (degree) => {
    const DEG_TO_RADIANS = 0.0174532925;
    const RADIUS = 50 * Math.SQRT2;
    let x1 = Math.cos((degree + 30) * DEG_TO_RADIANS) * RADIUS;
    let y1 = Math.sin((degree + 30) * DEG_TO_RADIANS) * RADIUS;
    let x2 = Math.cos((degree + 60) * DEG_TO_RADIANS) * RADIUS;
    let y2 = Math.sin((degree + 60) * DEG_TO_RADIANS) * RADIUS;

    setHandPos({
      firstHand: { x: x1, y: y1 * -1 },
      secondHand: { x: x2, y: y2 * -1 },
    });
    return;
  };
  // розкоментуй для тесту двох функцій вище
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setDeg(deg + 10);
  //   }, 500)
  //   if(deg % 20 == 0) {
  //     rotationCalc(deg);
  //   } else {
  //     blockUpCalc(deg);
  //   }
  //   return () => {
  //     clearTimeout(timeout);
  //   }
  // }, [deg]);

  useEffect(() => {
    console.log(lastJsonMessage);

    if (lastJsonMessage) {
      switch (lastJsonMessage.type) {
        case "positionChange":
          break;

        default:
          break;
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (isOpen) return;
    const moveStage = () => {
      let deltaX = 0;
      let deltaY = 0;
      // console.log(keyPressed);
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
      if (numKeysPressed >= 2) {
        // deltaX /= 2;
        // deltaY /= 2;
        deltaX /= 1.4;
        deltaY /= 1.4;
      }
      if (deltaX !== 0 || deltaY !== 0) {
        setStagePos((prevPos) => {
          const newPos = { x: prevPos.x + deltaX, y: prevPos.y + deltaY };
          // Ограничиваем движение, чтобы сцена не выходила за пределы канваса
          newPos.x = Math.max(0, Math.min(CANVAS_SIZE, newPos.x));
          newPos.y = Math.max(0, Math.min(CANVAS_SIZE, newPos.y));
          // console.log(newPos);
          return newPos;
        });
      }
    };
    moveStage();
  }, [keyPressed, stagePos.y, stagePos.x, mapSettings]);

  const renderGrid = () => {
    const lines = [];
    const halfScreenHeight = innerHeight / 2;
    const halfScreenWidth = innerWidth / 2;

    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      lines.push(
        <Line
          key={`line-x-${i}`}
          points={[
            i + halfScreenWidth - stagePos.x,
            0 + halfScreenHeight - stagePos.y,
            i + halfScreenWidth - stagePos.x,
            CANVAS_SIZE + halfScreenHeight - stagePos.y,
          ]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
      lines.push(
        <Line
          key={`line-y-${i}`}
          points={[
            0 + halfScreenWidth - stagePos.x, //отсуп от левого края
            i + halfScreenHeight - stagePos.y,
            CANVAS_SIZE + halfScreenWidth - stagePos.x,
            i + halfScreenHeight - stagePos.y,
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
            fill="#d4fad9"
          />

          {renderGrid()}
          <Group x={window.innerWidth / 2} y={window.innerHeight / 2}>
            <Circle
              x={handPos["firstHand"].x}
              y={handPos["firstHand"].y}
              radius={10}
              fill="#5e5e5e"
            ></Circle>
            <Circle
              x={handPos["secondHand"].x}
              y={handPos["secondHand"].y}
              radius={10}
              fill="#5e5e5e"
            ></Circle>
            <Circle
              radius={50} // Радиус кружка
              fill="#ababab"
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvass;
