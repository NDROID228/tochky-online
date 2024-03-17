import { makeAutoObservable } from "mobx";

const map = () => {
    const mapSettings = makeAutoObservable({
        currentX: 0,
        currentY: 0,
        setCurrentPosition(newPos) {
            // { x, y } = newPos; // Destructure the object
            this.currentX = newPos.x; // Use lowercase x and y
            this.currentY = newPos.y;
        },
    });
    return mapSettings; // Return the observable object
};

export default map;