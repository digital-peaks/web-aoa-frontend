import { shallowMount } from "@vue/test-utils";
//import InputView from "../../src/features/input/InputView.vue";
import AboutView from "../../src/features/about/AboutView.vue";
import ImpressumView from "../../src/features/impressum/ImpressumView.vue";
import LoginView from "../../src/features/login/LoginView.vue";

describe("AboutView", () => {
  it("renders the input page", () => {
    const wrapper = shallowMount(AboutView);
    expect(wrapper.contains("div")).toBe(true);
  });
});

describe("ImpressumView", () => {
  it("renders the input page", () => {
    const wrapper = shallowMount(ImpressumView);
    expect(wrapper.contains("div")).toBe(true);
  });
});

describe("LoginView", () => {
  it("renders the login page", () => {
    const wrapper = shallowMount(LoginView);
    expect(wrapper.contains("div")).toBe(true);
  });
});
