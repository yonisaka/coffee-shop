<script setup>
import { RouterView } from "vue-router";
import SocketioService from "./socketio.service.js";
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
          this.$router.push("/login");
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
