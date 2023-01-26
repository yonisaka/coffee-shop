<script setup>
// import { toRaw } from "vue";
import { RouterView } from "vue-router";
import SocketioService from "./socketio.service.js";
// import { storeToRefs } from "pinia";
// import { useAuthStore } from "@/stores/auth";

// const { user } = storeToRefs(useAuthStore());
// const authStore = useAuthStore();
// const user = computed(() => authStore.user);

// console.log(toRaw(authStore.user));
</script>

<template>
  <RouterView />
</template>

<script>
export default {
  created() {
    SocketioService.setupSocketConnection();
    this.$axios.interceptors.response.use(undefined, (error) => {
      return new Promise(() => {
        if (
          error.response.status === 401 &&
          error.config &&
          !error.config.__isRetryRequest
        ) {
          this.$router.push({ name: "Login" });
        }
        throw error;
      });
    });
  },
  beforeUnmount() {
    SocketioService.disconnect();
  },
};
</script>
