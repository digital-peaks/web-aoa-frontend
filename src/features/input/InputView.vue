<template>
  <div class="home">
    <InputFields msg="Welcome to Your Vue.js App" />
    
  </div>
</template>

<script>
// @ is an alias to /src
import InputFields from "@/features/input/InputFields.vue";

export default {
  name: "InputView",
  components: {
    InputFields
  },
};


</script>