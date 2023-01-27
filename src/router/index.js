import { createRouter, createWebHashHistory } from "vue-router";
// import Style from "@/views/StyleView.vue";
// import Home from "@/views/HomeView.vue";
import auth from "@/middleware/auth.js";

const routes = [
  {
    path: "/",
    redirect: "/coffee",
  },
  {
    path: "/coffee",
    name: "coffee",
    component: () => import("@/views/coffee/CoffeeIndex.vue"),
    meta: {
      title: "Coffee",
      middleware: auth,
    },
  },
  {
    path: "/coffee-form/:id?",
    name: "coffee-form",
    component: () => import("@/views/coffee/CoffeeForm.vue"),
    meta: {
      title: "Coffee Form",
      middleware: auth,
    },
  },
  {
    path: "/order",
    name: "order",
    component: () => import("@/views/order/OrderIndex.vue"),
    meta: {
      title: "Order",
      middleware: auth,
    },
  },
  {
    meta: {
      title: "Profile",
      middleware: auth,
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/profile/ProfileIndex.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginIndex.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});
export default router;
