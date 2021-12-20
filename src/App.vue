<template>
  <v-app>
    <div style="d-flex">
      <v-app-bar elevation="4" color="grey darken-4" class="px-1" dark>
        <div class="me-3">
          <router-link to="/"><LogoIcon width="75" /></router-link>
        </div>
        <v-toolbar-title>Web-AOA</v-toolbar-title>
        <v-btn to="/" dark text class="ms-8"> My Jobs </v-btn>
        <v-btn to="/about" dark text class="ms-3"> About </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon large>mdi-account-circle</v-icon>
        </v-btn>
      </v-app-bar>
    </div>
    <router-view />
  </v-app>
</template>

<script>
import LogoIcon from "@/components/LogoIcon.vue";

export default {
  name: "App",
  components: {
    LogoIcon,
  },
};
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #2c3e50;
}

/* Fix radius for floating inputs with input-group */
.input-group.floating .form-floating {
  flex: 1;
}
.input-group.floating .form-floating input,
.input-group.floating .form-floating select {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
</style>
