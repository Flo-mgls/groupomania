<template>
  <div class="container-fluid">
    <NavLogin />
    <form onsubmit="return false">
      <InfoLogin validateText="Se connecter" v-on:data-sent="updateData" v-on:request-sent="login">
        <template v-slot:messageError>{{ message }}</template>
      </InfoLogin>
    </form>
  </div>
</template>

<script>
import NavLogin from "@/components/NavLogin.vue";
import InfoLogin from "@/components/InfoLogin.vue";

export default {
  name: "Login",
  components: {
    NavLogin,
    InfoLogin,
  },
  data: () => {
    return {
      email: "",
      password: "",
      message: null,
    };
  },
  methods: {
    updateData(data) {
      this.email = data.email;
      this.password = data.password;
    },
    login() {
      this.$axios
        .post("user/login", this.$data)
        .then((data) => {
          sessionStorage.setItem("token", data.data.token);
          this.$axios.defaults.headers.common["Authorization"] =
            "Bearer " + data.data.token;
          this.$router.push("Feed");
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.message = "Email ou mot de passe invalide";
          }
          if (e.response.status === 500) {
            this.message = "Erreur serveur";
          }
          sessionStorage.removeItem("token");
        });
    },
  },
  mounted() {
    sessionStorage.removeItem("token");
    delete this.$axios.defaults.headers.common["Authorization"];
  },
};
</script>
