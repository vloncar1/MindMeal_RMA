const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "about", component: () => import("pages/About.vue") },
      { path: "settings", component: () => import("pages/Settings.vue") },
      { path: "contact", component: () => import("pages/Contact.vue") },
      { path: "email", component: () => import("pages/Email.vue") },
      { path: "login", component: () => import("pages/Login.vue") },
      { path: "signup", component: () => import("pages/SignUp.vue") },
      { path: "news", component: () => import("pages/News.vue") },
      { path: "plans", component: () => import("pages/SelectedPlan.vue") },
    ],
  },
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    meta: { requiresAdmin: true }, // Route Guard for Admin
    children: [
      { path: "", component: () => import("pages/AdminDashboard.vue") },
      { path: "manage-plans", component: () => import("pages/ManagePlans.vue") },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

