<script setup>
// import { reactive } from "vue";
// import { useMainStore } from "@/stores/main";
import {
  mdiAccount,
  mdiArrowLeft,
  // mdiMail,
  // mdiAsterisk,
  // mdiFormTextboxPassword,
  // mdiGithub,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
// import CardBox from "@/components/CardBox.vue";
// import BaseDivider from "@/components/BaseDivider.vue";
// import FormField from "@/components/FormField.vue";
// import FormControl from "@/components/FormControl.vue";
// import FormFilePicker from "@/components/FormFilePicker.vue";
import BaseButton from "@/components/BaseButton.vue";
// import BaseButtons from "@/components/BaseButtons.vue";
import UserCard from "@/components/UserCard.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

// const mainStore = useMainStore();

// const profileForm = reactive({
//   name: mainStore.userName,
//   email: mainStore.userEmail,
// });

// const passwordForm = reactive({
//   password_current: "",
//   password: "",
//   password_confirmation: "",
// });

// const submitProfile = () => {
//   mainStore.setUser(profileForm);
// };

// const submitPass = () => {
//   //
// };
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Profile" main>
        <BaseButton
          :to="{ name: 'coffee' }"
          :icon="mdiArrowLeft"
          label="Back"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <UserCard class="mb-6" />
    </SectionMain>
  </LayoutAuthenticated>
</template>
