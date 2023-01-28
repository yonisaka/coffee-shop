<script setup>
import { mdiBallotOutline, mdiArrowLeft, mdiAlertCircle } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import NotificationBar from "@/components/NotificationBar.vue";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        title="Forms Coffee"
        main
      >
        <BaseButton
          :to="{ name: 'coffee' }"
          :icon="mdiArrowLeft"
          label="Back"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>
      <NotificationBar
        v-if="notification.show"
        :color="notification.color"
        :icon="mdiAlertCircle"
      >
        {{ notification.messages }}
      </NotificationBar>
      <CardBox is-form @submit.prevent="submit">
        <div class="grid grid-cols-2 gap-3">
          <FormField label="Name *">
            <FormControl v-model="form.name" placeholder="Coffee Name" />
          </FormField>
          <FormField label="Price *">
            <FormControl
              v-model="form.price"
              type="number"
              placeholder="Price "
            />
          </FormField>
        </div>

        <FormField label="Image" help="Your Images File. Max 2048kb">
          <FormFilePicker
            accept="image/*"
            label="Upload"
            @change="uploadImage($event)"
          />
        </FormField>
        <BaseDivider />

        <FormField
          label="Description *"
          help="Your Description. Max 255 characters"
        >
          <FormControl
            v-model="form.description"
            type="textarea"
            placeholder="Explain product"
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" />
            <BaseButton
              v-if="$route.params.id"
              type="button"
              color="danger"
              outline
              label="Delete"
              @click="destroy()"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        price: "",
        file: null,
        description: "",
      },
      notification: {
        show: false,
        color: "info",
        messages: "",
      },
    };
  },
  mounted() {
    if (this.$route.params.id) this.getCoffee();
  },
  methods: {
    getCoffee() {
      this.$axios
        .get(`/api/coffee/${this.$route.params.id}`)
        .then((response) => {
          this.form = response.data.data;
          this.form.image = null;
        });
    },
    submit() {
      this.notification.show = false;
      if (this.$route.params.id) {
        this.$axios
          .put(`/api/coffee/${this.$route.params.id}`, this.form)
          .then((response) => {
            this.notification.messages = response.data.messages;
            this.notification.color = "info";
            this.notification.show = true;
          })
          .catch((error) => {
            this.notification.messages = error.response.data.messages;
            this.notification.color = "danger";
            this.notification.show = true;
          });
      } else {
        this.$axios
          .post("/api/coffee", this.form)
          .then((response) => {
            this.notification.messages = response.data.messages;
            this.notification.color = "info";
            this.notification.show = true;
          })
          .catch((error) => {
            this.notification.messages = error.response.data.messages;
            this.notification.color = "danger";
            this.notification.show = true;
          });
      }
    },
    destroy() {
      this.$axios
        .delete(`/api/coffee/${this.$route.params.id}`)
        .then((response) => {
          this.notification.messages = response.data.messages;
          this.notification.show = true;
          this.$router.push({ name: "coffee" });
        });
    },
    uploadImage(event) {
      let file = event.target.files[0];
      let formData = new FormData();
      formData.append("file", file);

      this.$axios.post("/api/upload", formData).then((response) => {
        this.form.image = response.data.filename;
      });
    },
  },
};
</script>
