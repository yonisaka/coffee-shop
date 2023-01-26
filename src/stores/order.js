import { defineStore } from "pinia";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
  }),
  getters: {
    getOrders: (state) => state.orders,
  },
  actions: {
    setOrders(payload) {
      this.orders = payload;
    },
  },
});
