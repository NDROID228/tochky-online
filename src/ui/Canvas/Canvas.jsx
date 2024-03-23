import React, { useEffect, useLayoutEffect, useState } from "react";
import { Stage, Layer, Rect, Line, Circle, Group } from "react-konva";
import map from "../../store/mapStore";
import userStore from "../../store/usersStore";
import useCursorAngleTracker from "../../hooks/useCursorAngleTracker";
import Player from "./../Game/Player/Player";

const calculateCoordinates = (angle, radius) => {
  const x = radius * Math.cos((angle * Math.PI) / 180);
  const y = radius * Math.sin((angle * Math.PI) / 180);
  return { x, y };
};

const Canvass = ({ isOpen, sendJsonMessage, lastJsonMessage }) => {
  const mapSettings = map();
  const radius = 50 * 1.5;
  const { GRID_SIZE, CANVAS_SIZE, STEP } = map();
  const { angle } = useCursorAngleTracker();
  const [stagePos, setStagePos] = useState({
    x: CANVAS_SIZE / 2,
    y: CANVAS_SIZE / 2,
  });
  const currentUser = userStore.getCurrentUser()
  const [keyPressed, setKeyPressed] = useState({});
  const [handPos, setHandPos] = useState({
    firstHand: { x: -50, y: -50 },
    secondHand: { x: -50, y: 50 },
  });


  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.type === "registration" && !currentUser) {
      userStore.setCurrentUser(lastJsonMessage.body.userId);
    }
    if (lastJsonMessage && lastJsonMessage.type === "userListUpdate" ) {
      console.log(lastJsonMessage.body.usersData);
    }
    
  }, [lastJsonMessage]);

  const updateHandPosition = (angle) => {
    const firstHandPos = calculateCoordinates(-angle + 45, radius);
    const secondHandPos = calculateCoordinates(-angle - 45, radius);
    setHandPos({ firstHand: firstHandPos, secondHand: secondHandPos });
  };
  const setBlock = (angle) => {
    const firstHandPos = calculateCoordinates(-angle + 15, radius);
    const secondHandPos = calculateCoordinates(-angle - 15, radius);
    setHandPos({ firstHand: firstHandPos, secondHand: secondHandPos });
  };

  useEffect(() => {
    const handleClickDown = (event) => {
      if (!event.repeat) {
        if (event.type === "mousedown") {
          const button =
            event.button === 0 ? "leftMouseButton" : "rightMouseButton";
          setKeyPressed((prev) => ({ ...prev, [button]: true }));
          sendJsonMessage({
            type: "keyEvent",
            body: { key: button, eventType: "keydown" },
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
          event.button === 0 ? "leftMouseButton" : "rightMouseButton";
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

    const handleMouseClick = (event) => {
      if (event.type === "mousedown") {
        const button =
          event.button === 0 ? "leftMouseButton" : "rightMouseButton";
        setKeyPressed((prev) => ({ ...prev, [button]: true }));
        sendJsonMessage({
          type: "keyEvent",
          body: { key: button, eventType: "keydown" },
        });
      } else {
        const button =
          event.button === 0 ? "leftMouseButton" : "rightMouseButton";
        setKeyPressed((prev) => ({ ...prev, [button]: false }));
        sendJsonMessage({
          type: "keyEvent",
          body: { key: button, eventType: "keyup" },
        });
      }
    };

    window.addEventListener("keydown", handleClickDown);
    window.addEventListener("keyup", handleClickUp);
    window.addEventListener("mousedown", handleMouseClick);
    window.addEventListener("mouseup", handleMouseClick);

    return () => {
      window.removeEventListener("keydown", handleClickDown);
      window.removeEventListener("keyup", handleClickUp);
      window.removeEventListener("mousedown", handleMouseClick);
      window.removeEventListener("mouseup", handleMouseClick);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (keyPressed.rightMouseButton) {
        setBlock(angle);
      } else {
        updateHandPosition(angle);
      }
    }
  }, [angle, keyPressed.rightMouseButton]);

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
      if (numKeysPressed >= 2) {
        deltaX /= 1.4;
        deltaY /= 1.4;
      }
      if (deltaX !== 0 || deltaY !== 0) {
        setStagePos((prevPos) => {
          const newPos = { x: prevPos.x + deltaX, y: prevPos.y + deltaY };
          newPos.x = Math.max(0, Math.min(CANVAS_SIZE, newPos.x));
          newPos.y = Math.max(0, Math.min(CANVAS_SIZE, newPos.y));
          return newPos;
        });
      }
    };
    moveStage();
  }, [keyPressed, stagePos.y, stagePos.x, mapSettings]);

  useEffect(() => {
    if (!isOpen) {
      sendJsonMessage({
        type: "currentUserPosition",
        body: {
          userUID: currentUser,
          x: stagePos.x,
          y: stagePos.y,
        },
      });
    }
  }, [stagePos]);

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
          stroke="#bfbdbd"
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
          stroke="#bfbdbd"
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

          <Player handPos={handPos} angle={angle} />
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvass;
