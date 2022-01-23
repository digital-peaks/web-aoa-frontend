<template>
  <v-app>
    <div style="d-flex">
      <v-app-bar elevation="4" color="grey darken-4" class="px-0" dark>
        <div class="me-3">
          <router-link :to="token ? '/' : 'login'"
            ><LogoIcon width="44"
          /></router-link>
        </div>
        <v-toolbar-title>Web-AOA</v-toolbar-title>
        <div class="d-none d-md-flex align-items-center">
          <template v-if="token">
            <v-btn to="/" dark text class="ms-8"> My Jobs </v-btn>
            <v-btn to="/inputDemo" dark text class="ms-3"> Demo </v-btn>
          </template>
          <template v-else>
            <v-btn to="/login" dark text class="ms-8"> Login </v-btn>
          </template>
          <v-btn to="/about" dark text class="ms-3"> About </v-btn>
          <v-btn to="/impressum" dark text class="ms-3"> Impressum </v-btn>
        </div>
        <v-spacer></v-spacer>
        <div class="d-flex d-md-none align-items-center">
        <!-- set z-index, because of Leafleat Map -->
        <v-menu offset-y z-index="1000">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                dark
                class="ms-8 p-1 menu-button"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon large>mdi-menu</v-icon>
              </v-btn>
            </template>
            <v-list>
              <template v-if="token">
                 <v-list-item link to="/">
                <v-list-item-title> My Jobs </v-list-item-title>
              </v-list-item>
               <v-list-item link to="/inputDemo">
                <v-list-item-title> Demo </v-list-item-title>
              </v-list-item>
              </template>
              <template v-else>
                  <v-list-item link to="/login">
                <v-list-item-title> Login </v-list-item-title>
              </v-list-item>
              </template>

              <v-list-item link to="/about">
                <v-list-item-title> About </v-list-item-title>
              </v-list-item>
              <v-list-item link to="/impressum">
                <v-list-item-title> Impressum </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-btn icon>
          <v-icon large>mdi-account-circle</v-icon>
        </v-btn>
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
      if (!["/login", "/impressum", "/about"].includes(this.$route.path)) {
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
.menu-button::before {
  background-color: transparent !important;
}
</style>
