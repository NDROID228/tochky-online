import { makeAutoObservable } from "mobx";

const map = () => {
  const mapSettings = makeAutoObservable({
    GRID_SIZE: 250,
    CANVAS_SIZE: 3000,
    STEP: 2,
  });
  return mapSettings;
};

export default map;
