import Vue from "vue";
import VueRouter from "vue-router";
import JobsView from "../features/jobs/JobsView.vue";
import InputView from "../features/input/InputView.vue";
import OutputView from "../features/output/OutputView.vue";

Vue.use(VueRouter);

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
  {
    path: "/output",
    name: "Output",
    component: OutputView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
