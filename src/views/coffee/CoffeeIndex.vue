<script setup>
import { mdiCoffee, mdiPencil, mdiPlus } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <NotificationBar v-if="notification" color="info" :icon="mdiMonitor">
        {{ notification.msg }}
      </NotificationBar>

      <SectionTitleLineWithButton :icon="mdiCoffee" title="Coffee Menu">
        <BaseButton
          v-if="$user.role == 'staff'"
          :to="{ name: 'coffee-form' }"
          :icon="mdiPlus"
          label="Tambah"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-4 gap-4">
        <CardBox v-for="coffe in coffees" :key="coffe.id">
          <img
            :src="coffe.image"
            :alt="coffe.description"
            class="w-full rounded-lg h-32"
          />
          <h4 class="mt-1">{{ coffe.name }}</h4>
          <small>Rp. {{ coffe.price.toLocaleString("en-US") }}</small>
          <div class="grid grid-cols-1 mt-2">
            <BaseButton
              v-if="$user.role == 'member'"
              label="Pesan"
              :icon="mdiCoffee"
              color="info"
              class="w-full inline-block"
              small
              outline
              @click="openModal(coffe)"
            />
            <BaseButton
              v-if="$user.role == 'staff'"
              label="Edit"
              :icon="mdiPencil"
              :to="{ name: 'coffee-form', params: { id: coffe.id } }"
              color="info"
              small
              outline
            />
          </div>
        </CardBox>
      </div>
      <CardBoxModal
        v-model="modalOrder"
        title="Please Confirm Order"
        button-label="Confirm"
        has-cancel
        @confirm="orderCoffee(coffee)"
        @cancel="modalOrder = false"
      >
        <p>Order this {{ coffee.name }}?</p>
        <img
          :src="coffee.image"
          :alt="coffee.name"
          class="w-full rounded-lg h-72"
        />
        <h6>Description :</h6>
        <small>{{ coffee.description }}</small>
      </CardBoxModal>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: io("http://localhost:3000"),
      coffees: [],
      notification: "",
      modalOrder: false,
      coffee: {},
    };
  },
  mounted() {
    this.getCoffees();
    this.getNotification();
  },
  methods: {
    openModal(coffee) {
      this.modalOrder = true;
      this.coffee = coffee;
    },
    getNotification() {
      this.socket.on(`receive-${this.$user.id}`, (data) => {
        this.notification = data;
      });
    },
    orderCoffee(coffee) {
      let data = {
        id: this.$user.id,
        coffeeId: coffee.id,
        msg: this.$user.username + " order " + coffee.name,
        status: "pending",
      };

      this.socket.emit("order", data);
    },
    getCoffees() {
      this.$axios
        .get("/api/coffee")
        .then((response) => {
          this.coffees = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
