import { makeAutoObservable } from "mobx";

class UserStore {
  currentUser = null;

  constructor() {
    makeAutoObservable(this);
  }
  setCurrentUser(userId) {
    this.currentUser = userId;
  }
  getCurrentUser() {
    return this.currentUser;
  }
}

const userStore = new UserStore();
export default userStore;
