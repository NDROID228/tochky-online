// import React, { useEffect, useState } from "react";
// import { Stage, Layer, Circle, Rect } from "react-konva";

// const Canvass = () => {
//   const [stagePos, setStagePos] = useState({ x: 2500, y: 2500 });
//   const [keyPressed, setKeyPressed] = useState({});
  
//   // путем проб и ошибок пришел к такому назначению событий
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       setKeyPressed((prev) => ({ ...prev, [event.key]: true }));
//     };

//     const handleKeyUp = (event) => {
//       setKeyPressed((prev) => ({ ...prev, [event.key]: false }));
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);

//     return;
//   }, []);

//   // бинды на кнопки
//   useEffect(() => {
//     const moveStage = () => {
//       if (keyPressed["w"]) {
//         setStagePos((prevPos) => ({ ...prevPos, y: prevPos.y - 5 }));
//       }
//       if (keyPressed["a"]) {
//         setStagePos((prevPos) => ({ ...prevPos, x: prevPos.x - 5 }));
//       }
//       if (keyPressed["s"]) {
//         setStagePos((prevPos) => ({ ...prevPos, y: prevPos.y + 5 }));
//       }
//       if (keyPressed["d"]) {
//         setStagePos((prevPos) => ({ ...prevPos, x: prevPos.x + 5 }));
//       }
//     };

//     moveStage();

//     return;
//   }, [keyPressed]);

//   return (
//     <div
//       style={{
//         width: "100vw",
//         height: "100vh",
//         touchAction: "pan-y",
//         overflow: "hidden",
//       }}
//     >
//       {/* это точка в центре экрана (хз зачем) */}
//       <div
//         style={{
//           position: "absolute",
//           width: "5px",
//           height: "5px",
//           left: "50%",
//           top: "50%",
//           backgroundColor: "black",
//         }}
//       ></div>
//       {/* это фейк сетка, потом надо заменить */}
//       <div
//         style={{
//           position: "absolute",
//           width: "100%",
//           height: "100%",
//           backgroundSize: "500px",
//           backgroundImage: "url(/grid.png)",
//           backgroundRepeat: "repeat",
//         }}
//       ></div>
//       {/* Stage - это канва */}
//       <Stage x={-2500} y={-2500} width={5000} height={5000}>
//         {/* Layer - это группа, которая двигается по клавишам WASD */}
//         <Layer x={stagePos.x} y={stagePos.y}>
//           {/* Rect - это шляпа (полная) */}
//           <Rect x={0} y={0} width={5000} height={5000} />
//           {/* Circle - это кружочек, который видно на экране со старта для теста движения Layer */}
//           <Circle x={0} y={0} stroke="black" radius={20} fill="black" />
//         </Layer>
//       </Stage>
//     </div>
//   );
// };

// export default Canvass;
import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";

const GRID_SIZE = 50; // Размер ячейки сетки
const CANVAS_SIZE = 5000; // Размер канваса

const Canvass = () => {
  const [stagePos, setStagePos] = useState({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 });
  const [keyPressed, setKeyPressed] = useState({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeyPressed((prev) => ({ ...prev, [event.key]: true }));
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
    const moveStage = () => {
      const step = 5;
      if (keyPressed["w"]) {
        setStagePos((prevPos) => ({ ...prevPos, y: Math.max(prevPos.y - step, 0) }));
      }
      if (keyPressed["a"]) {
        setStagePos((prevPos) => ({ ...prevPos, x: Math.max(prevPos.x - step, 0) }));
      }
      if (keyPressed["s"]) {
        setStagePos((prevPos) => ({ ...prevPos, y: Math.min(prevPos.y + step, CANVAS_SIZE) }));
      }
      if (keyPressed["d"]) {
        setStagePos((prevPos) => ({ ...prevPos, x: Math.min(prevPos.x + step, CANVAS_SIZE) }));
      }
    };

    moveStage();
  }, [keyPressed]);

  const renderGrid = () => {
    const lines = [];
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      lines.push(
        <Line
          key={`line-x-${i}`}
          points={[i - stagePos.x, 0 - stagePos.y, i - stagePos.x, CANVAS_SIZE - stagePos.y]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
      lines.push(
        <Line
          key={`line-y-${i}`}
          points={[0 - stagePos.x, i - stagePos.y, CANVAS_SIZE - stagePos.x, i - stagePos.y]}
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
        touchAction: "pan-y",
        overflow: "hidden",
      }}
    >
      <Stage x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE}>
        <Layer>
          <Rect x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} fill="#fff" />
          {renderGrid()}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvass;
