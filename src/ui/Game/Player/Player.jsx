import React, { useEffect, useRef } from "react";
import { Group, Circle } from "react-konva";

const calculateCoordinates = (angle, radius) => {
  const x = radius * Math.cos((angle * Math.PI) / 180);
  const y = radius * Math.sin((angle * Math.PI) / 180);
  return { x, y };
};

const Player = ({ handPos, angle }) => {
  const eyesPos = useRef({
    leftEye: {
      x: 0,
      y: 0,
    },
    leftEyePupil: {
      x: 0,
      y: 0,
    },
    rightEye: {
      x: 0,
      y: 0,
    },
    rightEyePupil: {
      x: 0,
      y: 0,
    },
  });

  const updateEyesCords = (angle) => {
    const angleEyesDiff = 35;
    const leftEyePos = calculateCoordinates(-angle - angleEyesDiff, 30);
    const leftEyePupilPos = calculateCoordinates(-angle - angleEyesDiff + 5, 33);
    const rightEyePos = calculateCoordinates(-angle + angleEyesDiff, 30);
    const rightEyePupilPos = calculateCoordinates(-angle + angleEyesDiff - 5, 33);
    eyesPos.current = {
      leftEye: leftEyePos,
      leftEyePupil: leftEyePupilPos,
      rightEye: rightEyePos,
      rightEyePupil: rightEyePupilPos,
    };
  };

  useEffect(() => {
    console.log(calculateCoordinates(angle, 50));
    updateEyesCords(angle);
  }, [angle]);

  return (
    <Group x={window.innerWidth / 2} y={window.innerHeight / 2}>
      <Circle
        radius={50} // Радиус кружка
        fill="#ababab"
      />
      <Circle radius={45} fill="#ffdd9f" />

      <Circle
        radius={14}
        x={eyesPos.current.leftEye.x}
        y={eyesPos.current.leftEye.y}
        fill="#ffffff"
      />
      <Circle
        radius={8}
        x={eyesPos.current.leftEyePupil.x}
        y={eyesPos.current.leftEyePupil.y}
        fill="#000000"
      />
      <Circle
        radius={14}
        x={eyesPos.current.rightEye.x}
        y={eyesPos.current.rightEye.y}
        fill="#ffffff"
      />
      <Circle
        radius={8}
        x={eyesPos.current.rightEyePupil.x}
        y={eyesPos.current.rightEyePupil.y}
        fill="#000000"
      />

      <Circle
        x={handPos["firstHand"].x}
        y={handPos["firstHand"].y}
        radius={10}
        fill="#5e5e5e"
      />
      <Circle
        x={handPos["secondHand"].x}
        y={handPos["secondHand"].y}
        radius={10}
        fill="#5e5e5e"
      />
    </Group>
  );
};

export default Player;
