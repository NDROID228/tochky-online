import { makeAutoObservable } from "mobx";

const userStore = () => {
  const user = makeAutoObservable({
    user: {
        name:"",
    },

    addUser(user) {
      this.user.push(user);
    },
  });
  return user;
};

export default userStore;
