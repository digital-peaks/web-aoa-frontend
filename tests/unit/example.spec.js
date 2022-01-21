import { shallowMount } from "@vue/test-utils";
import InputView from "../../src/features/input/InputView.vue";
import AboutView from "../../src/features/about/AboutView.vue";

describe("AboutView", () => {
  it("redners the input page", () => {
    const wrapper = shallowMount(AboutView);
    expect(wrapper.contains("div")).toBe(true);
  });

  it("input page", () => {
    const wrapper = shallowMount(InputView);
    expect(wrapper.contains("div")).toBe(true);
  });
});
