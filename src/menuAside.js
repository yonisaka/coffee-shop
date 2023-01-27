import { mdiTelevisionGuide, mdiCoffee } from "@mdi/js";

export default [
  {
    to: "/coffee",
    icon: mdiCoffee,
    label: "Coffee",
    permission: "all",
  },
  {
    to: "/order",
    icon: mdiTelevisionGuide,
    label: "Order",
    permission: "staff",
  },
];
