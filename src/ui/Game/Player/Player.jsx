import React, { useEffect, useRef } from "react";
import { Group, Circle } from "react-konva";
import calculateCoordinates from "../../../usefulFunctions/calculateCoordinates";

const Player = ({ handPos, angle = 180, isOpen = false }) => {
  const eyesPos = useRef({
    leftEye: {
      x: -24.648185364002206,
      y: 17.10166536515632,
    },
    leftEyePupil: {
      x: -28.649389916756025,
      y: 16.377193208779037,
    },
    rightEye: {
      x: -24.500484637701028,
      y: -17.31260386301771,
    },
    rightEyePupil: {
      x: -28.507760319866644,
      y: -16.622502866446947,
    },
  });

  const updateEyesCords = (angle) => {
    const angleEyesDiff = 35;
    const leftEyePos = calculateCoordinates(-angle - angleEyesDiff, 30);
    const leftEyePupilPos = calculateCoordinates(
      -angle - angleEyesDiff + 5,
      33
    );
    const rightEyePos = calculateCoordinates(-angle + angleEyesDiff, 30);
    const rightEyePupilPos = calculateCoordinates(
      -angle + angleEyesDiff - 5,
      33
    );
    eyesPos.current = {
      leftEye: leftEyePos,
      leftEyePupil: leftEyePupilPos,
      rightEye: rightEyePos,
      rightEyePupil: rightEyePupilPos,
    };
  };

  useEffect(() => {
    if (!isOpen) {
      updateEyesCords(angle);
    }
  }, [angle]);

  return (
    <Group x={window.innerWidth / 2} y={window.innerHeight / 2}>
      <Circle
        radius={50} // Радиус кружка
        fill="#ababab"
      />
      <Circle
        radius={45}
        //   fill="#99D5F2"
        fill="#ECD6B6"
      />

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
        fill="#0D0D0D"
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
        fill="#0D0D0D"
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
