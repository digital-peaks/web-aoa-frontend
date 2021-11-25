import { createRouter, createWebHistory } from "vue-router";
import JobsView from "../features/jobs/JobsView.vue";
import InputView from "../features/input/InputView.vue";

const routes = [
  {
    path: "/input",
    name: "Input",
    component: InputView,
  },
  {
    path: "/",
    name: "Jobs",
    component: JobsView,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../features/about/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
