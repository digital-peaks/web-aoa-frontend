import { shallowMount } from "@vue/test-utils";
import LogoIcon from "@/components/LogoIcon.vue";

describe("LogoIcon.vue", () => {
  it("renders LogoIcon", () => {
    const wrapper = shallowMount(LogoIcon, {
      props: { width: "200" },
    });
    expect(wrapper).toBeDefined();
  });
});
