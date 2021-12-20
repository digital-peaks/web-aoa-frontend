<template>
  <div class="d-flex flex-column">
    <div class="d-flex" style="box-shadow: 0 0 1px #666">
      <div
        v-for="color in data.colors"
        :key="color"
        :style="{
          flex: 1,
          backgroundColor: color,
          height: '15px',
        }"
      ></div>
    </div>
    <div class="d-flex align-items-center">
      <div
        v-for="value in data.values"
        :key="value"
        class="text-center"
        style="flex: 1; font-size: 10px"
      >
        {{ value.toFixed(fixed) }}
      </div>
    </div>
  </div>
</template>

<script>
import chroma from "chroma-js";
import range from "lodash.range";

export default {
  name: "ColorLegend",
  props: {
    scale: {
      validator: (value) => {
        return typeof value === "string" || Array.isArray(value);
      },
    },
    steps: {
      type: Number,
      default: 5,
    },
    domain: {
      type: Array,
      default: () => [0, 1],
    },
    fixed: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    data: function () {
      console.log(this.scale);
      const scale = chroma.scale(this.scale);

      const [min, max] = this.domain;

      // calculate values based on the given domain and steps:
      const step = max / (this.steps - 1);
      const values = [...range(min, max, step), max];

      // calculate colors for the DI color legend:
      const colors = values.map((val) => scale(val).hex());

      return {
        colors,
        values,
      };
    },
  },
};
</script>
