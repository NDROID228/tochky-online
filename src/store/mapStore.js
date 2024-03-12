import { makeAutoObservable } from "mobx";

const createCounter = () => {
    return makeAutoObservable({
      value: 5,
      increment() {
        this.value++
      },
    })
  }

export default createCounter;