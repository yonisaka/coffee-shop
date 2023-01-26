<script setup>
import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBox from "@/components/CardBox.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButton from "@/components/BaseButton.vue";
import { mdiCheckCircle } from "@mdi/js";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex flex-col justify-between">
        <h1 v-if="orders.length < 1" class="text-2xl font-bold">
          Order Kosong
        </h1>
        <CardBox
          v-for="(order, i) in orders"
          v-else
          :key="i"
          orderclass="mb-6 last:mb-0"
          class="m-2"
          is-hoverable
        >
          <BaseLevel>
            <BaseLevel type="justify-start">
              <h3 class="text-xl">{{ order.msg }}</h3>
            </BaseLevel>
            <BaseButton
              v-if="order.status === 'pending'"
              :icon="mdiCheckCircle"
              type="button"
              color="warning"
              label="Finish Order"
              small
              @click="finishOrder(order)"
            >
              {{ order.id }}
            </BaseButton>
            <BaseButton
              v-else
              :icon="mdiCheckCircle"
              type="button"
              color="success"
              label="Order Finished"
              small
              disabled
            />
          </BaseLevel>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: io("http://localhost:3000"),
      orders: [],
    };
  },
  mounted() {
    this.orders = localStorage.getItem("orders")
      ? JSON.parse(localStorage.getItem("orders"))
      : [];
    this.socket.on("order", (data) => {
      this.orders.push(data);
      localStorage.setItem("orders", JSON.stringify(this.orders));
    });
  },
  methods: {
    finishOrder(order) {
      const storageOrders = localStorage.getItem("orders")
        ? JSON.parse(localStorage.getItem("orders"))
        : [];

      const existingOrder = storageOrders.find(
        (item) => item.id === order.id && item.coffeeId === order.coffeeId
      );

      if (existingOrder) {
        storageOrders.forEach((item) => {
          if (
            item.id === order.id &&
            item.coffeeId === order.coffeeId &&
            item.status === "pending"
          ) {
            storageOrders.splice(storageOrders.indexOf(item), 1);
          }

          localStorage.setItem("orders", JSON.stringify(this.orders));
        });
        Object.assign(existingOrder, { status: "finished" });
        storageOrders.push(existingOrder);
        localStorage.setItem("orders", JSON.stringify(storageOrders));
      }

      let data = {
        id: order.id,
        msg: "Your order has been finished",
      };

      this.socket.emit(`finish-order`, data);

      this.orders = localStorage.getItem("orders")
        ? JSON.parse(localStorage.getItem("orders"))
        : [];
    },
  },
};
</script>
