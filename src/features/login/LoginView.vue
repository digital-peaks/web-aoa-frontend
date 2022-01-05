<template>
  <div class="d-flex flex-column align-center">
    <div class="pt-10 p-3 wrapper">
      <h3>Login</h3>

      <v-card elevation="3" class="p-3">
        <form v-on:submit="onSubmitForm">
          <div>
            <v-text-field
              filled
              type="text"
              label="Email"
              v-model="email"
              :error-messages="
                v$.email.$error ? ['This field is required'] : []
              "
            ></v-text-field>
          </div>
          <div>
            <v-text-field
              filled
              type="password"
              label="Password"
              v-model="password"
              :error-messages="
                v$.password.$error ? ['This field is required'] : []
              "
            ></v-text-field>
          </div>
          <div class="text-right">
            <v-btn
              type="submit"
              color="primary"
              width="100%"
              :loading="loading"
              :disabled="loading"
            >
              Log In
            </v-btn>
          </div>
          <div class="mt-6" v-if="errorCode > 0">
            <v-alert type="error" outlined style="margin-bottom: 0">
              {{
                errorCode === 401
                  ? "Incorrect email or password."
                  : "Unable to connect to server. Please try again later."
              }}
            </v-alert>
          </div>
        </form>
      </v-card>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import * as API from "@/common/api";

export default {
  name: "InputView",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      errorCode: 0,
      loading: false,
      email: "",
      password: "",
    };
  },
  validations() {
    return {
      email: {
        required,
      },
      password: {
        required,
      },
    };
  },
  methods: {
    /**
     * Checks the form and send it to the API.
     */
    async onSubmitForm(e) {
      // prevent that the form is send:
      e.preventDefault();

      const isFormCorrect = await this.v$.$validate();

      if (!isFormCorrect) {
        return;
      }

      const body = { email: this.email, password: this.password };

      this.loading = true;
      this.errorCode = 0;
      try {
        const { data } = await API.userLogin(body);
        this.$store.dispatch("setToken", data.token);
        // Go to the job overview
        this.$router.push("/");
      } catch (err) {
        console.error(err);

        // get response code from axios
        this.errorCode = err?.response?.status || 500;

        if (this.errorCode === 401) {
          this.v$.$reset();
          // remove password
          this.password = "";
        }
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
}
@media (min-width: 600px) {
  .wrapper {
    width: 450px;
  }
}
</style>
