<template>
  <v-app>
    <div style="d-flex">
      <v-app-bar elevation="4" color="grey darken-4" class="px-1" dark>
        <div class="me-3">
          <router-link to="/"><LogoIcon width="55" /></router-link>
        </div>
        <v-toolbar-title>Web-AOA</v-toolbar-title>
        <template v-if="token">
          <v-btn to="/" dark text class="ms-8"> My Jobs </v-btn>
          <v-btn to="/inputDemo" dark text class="ms-3"> Demo </v-btn>
          <v-btn to="/about" dark text class="ms-3"> About </v-btn>
          <v-btn to="/impressum" dark text class="ms-3"> Impressum </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon large>mdi-account-circle</v-icon>
          </v-btn>
        </template>
      </v-app-bar>
    </div>
    <template v-if="loading">
      <div class="mt-10 text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </template>
    <template v-if="!loading">
      <router-view />
    </template>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import * as API from "@/common/api";
import LogoIcon from "@/components/LogoIcon.vue";

export default {
  name: "App",
  components: {
    LogoIcon,
  },
  data() {
    return { loading: false };
  },
  computed: mapState({
    user(state) {
      return state.user;
    },
    token(state) {
      return state.token;
    },
    isLoggedIn(state) {
      return state.token && state.user.id;
    },
  }),
  methods: {
    redirectToLogin() {
      this.$store.dispatch("setToken", "");
      if (this.$route.path !== "/login") {
        this.$router.push("/login");
      }
    },
  },
  async mounted() {
    if (this.token) {
      this.loading = true;
      try {
        const { data } = await API.userMe();
        this.$store.dispatch("setUser", data);
      } catch (err) {
        if (err?.response?.status === 401) {
          // not authorized anymore
          this.redirectToLogin();
        }
      }
      this.loading = false;
    } else {
      // Redirect to login because no token exist
      this.redirectToLogin();
    }
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
