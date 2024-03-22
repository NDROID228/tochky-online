import React from "react";
import { Group, Circle } from "react-konva";

const Player = ({ handPos }) => {
  return (
    <Group x={window.innerWidth / 2} y={window.innerHeight / 2}>
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
      <Circle
        radius={50} // Радиус кружка
        fill="#ababab"
      />
      <Circle radius={45} fill="#ffdd9f" />
    </Group>
  );
};

export default Player;
