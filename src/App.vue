<template>
  <div>
    <header class="p-3 border-bottom">
      <div class="container">
        <div
          class="
            d-flex
            flex-wrap
            align-items-center
            justify-content-center justify-content-lg-start
          "
        >
          <router-link
            to="/"
            href="/"
            class="
              d-flex
              align-items-center
              mb-2 mb-lg-0
              text-dark text-decoration-none
            "
          >
            <LogoIcon width="60" />
          </router-link>

          <ul
            class="
              nav
              col-12 col-lg-auto
              me-lg-auto
              mb-2 mb-md-0
              ms-2
              justify-content-center
            "
          >
            <router-link to="/" class="nav-link px-2 link-dark"
              >Jobs</router-link
            >
            <router-link to="/about" class="nav-link px-2 link-dark"
              >About</router-link
            >
          </ul>

          <div class="dropdown text-end d-flex">
            <a
              href="#"
              class="d-block link-dark text-decoration-none"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div
                style="width: 40px; height: 40px"
                class="
                  d-flex
                  justify-content-center
                  align-items-center
                  bg-light
                  rounded-circle
                  border
                  fw-bold
                  text-primary
                "
              >
                AO
              </div>
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end text-small"
              aria-labelledby="dropdownUser1"
            >
              <li><a class="dropdown-item" href="#">User</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <router-view />
  </div>
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
