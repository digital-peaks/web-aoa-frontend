import { shallowMount, mount } from "@vue/test-utils";
//import InputView from "../../src/features/input/InputView.vue";
import AboutView from "../../src/features/about/AboutView.vue";
import ImpressumView from "../../src/features/impressum/ImpressumView.vue";
import LoginView from "../../src/features/login/LoginView.vue";
import LogoIcon from "../../src/components/LogoIcon.vue";

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

describe("LogoIcon", () => {
  it("checks Logo icon component", () => {
    const wrapper = mount(LogoIcon, {
      propsData: {
        width: "200",
        height: "200",
      },
    });
    expect(wrapper.contains("svg")).toBe(true);
  });
});
