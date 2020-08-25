<template>
  <div class="container-fluid">
    <form onsubmit="return false">
      <NavLogin />
      <InfoSignup v-on:data-sent="updateDataSignup" />
      <InfoLogin
        validateText="S'inscrire"
        v-on:data-sent="updateDataLogin"
        v-on:request-sent="signup"
      >
      <template v-slot:messagePassword>Doit contenir: 1 majuscule, 1 minuscule et 1 chiffre (8 caractères minimum)</template>
        <template v-slot:messageError>{{ message }}</template>
      </InfoLogin>
    </form>
  </div>
</template>

<script>
import NavLogin from "@/components/NavLogin.vue";
import InfoLogin from "@/components/InfoLogin.vue";
import InfoSignup from "@/components/InfoSignup.vue";

export default {
  name: "Signup",
  components: {
    NavLogin,
    InfoLogin,
    InfoSignup,
  },
  data: () => {
    return {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      message: null,
    };
  },
  methods: {
    updateDataSignup(data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
    },
    updateDataLogin(data) {
      this.email = data.email;
      this.password = data.password;
    },
    signup() {
      this.$axios
        .post("user/signup", this.$data)
        .then(() => {
          this.$axios.post("user/login", this.$data).then((data) => {
            sessionStorage.setItem("token", data.data.token);
            this.$axios.defaults.headers.common["Authorization"] =
              "Bearer " + data.data.token;
            this.$router.push("Feed");
          });
        })
        .catch((e) => {
          if (e.response.status === 500) {
            this.message = "Erreur serveur";
          }
          sessionStorage.removeItem("token");
        });
    },
  },
  mounted() {
    document.title = "Création de compte | Groupomania";
  }
};
</script>