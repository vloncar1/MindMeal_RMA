import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Add route guard
  Router.beforeEach((to, from, next) => {
    const userRole = localStorage.getItem("role"); // Role is saved in localStorage
    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      if (userRole === "Admin") next();
      else next("/login");
    } else {
      next();
    }
  });

  return Router;
});
