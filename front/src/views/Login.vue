<!-- VIEW LOGIN - Page de login -->

<template>
  <div class="container-fluid">
    <!-- Navigation -->
    <NavLogin />
    <!-- Fin -->
    <!-- Form pour login -->
    <form onsubmit="return false">
      <InfoLogin validateText="Se connecter" v-on:data-sent="updateData" v-on:request-sent="login">
        <template v-slot:messageError>{{ message }}</template>
      </InfoLogin>
    </form>
    <!-- Fin -->
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
      message: null, // Message d'erreur
    };
  },
  methods: {
    updateData(data) {
      // Stock les infos de connexion
      this.email = data.email;
      this.password = data.password;
    },
    login() {
      // Connecte l'utilisateur
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
    // Supprime le token pour la déconnexion et défini le titre
    sessionStorage.removeItem("token");
    delete this.$axios.defaults.headers.common["Authorization"];
    document.title = "Se connecter | Groupomania";
  },
};
</script>
