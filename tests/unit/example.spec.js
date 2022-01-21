import { shallowMount } from "@vue/test-utils";
//import InputView from "../../src/features/input/InputView.vue";
import AboutView from "../../src/features/about/AboutView.vue";

/*describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });

    expect(wrapper.props()).toBe(msg);
  });
});*/

describe("AboutView", () => {
  it("redners the input page", () => {
    const wrapper = shallowMount(AboutView);
    expect(wrapper.contains("div")).toBe(true);
  });
});
