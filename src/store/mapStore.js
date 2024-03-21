import { makeAutoObservable } from "mobx";

const map = () => {
  const mapSettings = makeAutoObservable({
    GRID_SIZE: 250,
    CANVAS_SIZE: 5000,
    STEP: 5,
  });
  return mapSettings;
};

export default map;
