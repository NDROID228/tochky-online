const calculateCoordinates = (angle, radius) => {
  const x = radius * Math.cos((angle * Math.PI) / 180);
  const y = radius * Math.sin((angle * Math.PI) / 180);
  return { x, y };
};

export default calculateCoordinates;
