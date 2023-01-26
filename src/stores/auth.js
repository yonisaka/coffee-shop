import { defineStore } from "pinia";

export const useAuthStore = defineStore("Auth", {
  state: () => {
    return {
      user: {},
      token: "",
    };
  },
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
  actions: {
    setUser(payload) {
      localStorage.setItem("user", JSON.stringify(payload));
      this.user = payload;
    },
    setToken(payload) {
      localStorage.setItem("token", payload);
      this.token = payload;
    },
  },
});
