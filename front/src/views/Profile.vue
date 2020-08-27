<!-- VIEW PROFILE - Page des profils -->

<template>
  <div class="container-fluid">
    <!-- Alert si l'user est non connecté -->
    <Alert v-if="!connected" :alertType="alert.type" :alertMessage="alert.message" />
    <!-- Fin -->
    <div v-else>
      <!-- Navigation -->
      <NavFeed />
      <!-- Fin -->
      <!-- Form pour update le profil si c'est notre profil -->
      <section class="border-bottom" v-if="user.yourProfile === 1">
        <h2
          class="h6"
          data-toggle="collapse"
          href="#collapseUpdateProfile"
          role="button"
          aria-expanded="false"
          aria-controls="collapseUpdateProfile"
        >Modifier votre profil</h2>
        <form class="collapse" id="collapseUpdateProfile">
          <div class="custom-file mb-3">
            <input
              name="image"
              type="file"
              class="custom-file-input"
              accept="image/*"
              v-on:change="updateAvatar($event)"
            />
            <label class="custom-file-label" for="image">Choisir un avatar</label>
          </div>
          <div class="input-group mb-3">
            <input
              class="form-control"
              type="text"
              v-model="user.pseudo"
              name="pseudo"
              aria-label="Modifiez pseudo"
              aria-describedby="pseudoInput"
            />
            <div class="input-group-append">
              <span class="input-group-text" id="pseudoInput">Pseudo</span>
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              class="form-control"
              type="email"
              v-model="user.email"
              name="email"
              aria-label="Modifiez email"
              aria-describedby="emailInput"
            />
            <div class="input-group-append">
              <span class="input-group-text" id="emailInput">Email</span>
            </div>
          </div>
          <label for="bio">Bio</label>
          <textarea
            class="form-control mb-3"
            id="bio"
            name="bio"
            cols="130"
            rows="3"
            maxlength="256"
            v-model="user.bio"
          ></textarea>
          <input
            class="form-control text-center mb-3"
            type="password"
            placeholder="Changer de mot de passe"
            id="newPassword"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            aria-label="Nouveau mot de passe"
          />
          <div class="input-group">
            <input
              class="form-control text-center"
              type="password"
              placeholder="Mot de passe"
              id="password"
              aria-label="Mot de passe pour confirmer"
            />
            <div class="input-group-append">
              <button
                type="submit"
                class="btn btn-light"
                v-on:click.prevent="updateProfile"
              >Confirmer</button>
            </div>
          </div>
          <p class="text-danger">{{ messageError }}</p>
        </form>
      </section>
      <!-- Fin -->

      <!-- Profil de l'utilsateur -->
      <section class="mt-5">
        <img
          :src="user.avatarUrl"
          class="card-img avatar rounded-circle mr-1"
          alt="Avatar de l'utilisateur"
        />
        <h2 class="mt-1">{{ fullName }}</h2>
        <p class="text-muted" aria-label="Pseudo" v-if="user.pseudo != null">@{{ user.pseudo }}</p>
        <p class="text-muted mt-5">{{ user.dateCreation }}</p>
        <div class="row" v-if="user.bio != null">
          <div class="col-md-6 offset-md-3">
            <p class="text-center" aria-label="Bio">{{ user.bio }}</p>
          </div>
        </div>
        <p class="mt-5">
          Contact:
          <a :href="`mailto:${user.email}`" class="font-weight-bold">{{ user.email }}</a>
        </p>
      </section>
      <!-- Fin -->

      <!-- Form pour supprimer son compte -->
      <section class="mt-5 border-top" v-if="user.yourProfile === 1">
        <h2
          class="mb-4 mt-2 text-danger h6"
          data-toggle="collapse"
          href="#collapseDeleteProfile"
          role="button"
          aria-expanded="false"
          aria-controls="collapseDeleteProfile"
        >Supprimer votre compte</h2>
        <form class="collapse row" id="collapseDeleteProfile">
          <div class="col-md-4 offset-md-4 input-group">
            <input
              class="form-control text-center"
              type="password"
              placeholder="Mot de passe"
              id="passwordDelete"
              aria-label="Mot de passe pour confirmer"
            />
            <div class="input-group-append mb-4">
              <button type="submit" class="btn btn-light" v-on:click="deleteProfile">Supprimer</button>
            </div>
            <p class="text-danger">{{ messageError }}</p>
          </div>
        </form>
      </section>
      <!-- Fin -->
    </div>
  </div>
</template>

<script>
import NavFeed from "@/components/NavFeed.vue";
import Alert from "@/components/Alert.vue";

export default {
  name: "Profile",
  components: {
    NavFeed,
    Alert,
  },
  data: () => {
    return {
      connected: true, // Défini si l'user est connecté
      messageError: null,
      alert: {
        type: "",
        message: "",
      },
      user: {}, // Stock les infos de l'utilisateur
    };
  },
  computed: {
    fullName() {
      // Retourne le nom complet
      return `${this.user.firstName} ${this.user.lastName}`;
    },
  },
  methods: {
    alertConstant(type, message) {
      // Crée une alerte
      const dataAlert = this.$data.alert;
      this.connected = false;
      dataAlert.type = type;
      dataAlert.message = message;
    },
    getUser() {
      // Récupère les infos de l'utilisateur
      this.$axios
        .get(`user/${this.$route.params.id}/profile`)
        .then((data) => {
          this.user = data.data[0];
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.alertConstant("alert-danger mt-5", "Veuillez vous connecter");
          }
          if (e.response.status === 400) {
            this.alertConstant("alert-warning mt-5", "Utilisateur non trouvé");
          }
          if (e.response.status === 500) {
            this.alertConstant("alert-warning mt-5", "Erreur serveur");
          }
        });
    },
    updateAvatar(event) {
      // Update son avatar
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("image", image);
      this.$axios
        .put("user/modify", formData)
        .then(() => {
          this.getUser();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateProfile() {
      // Update les autres infos
      const email = this.user.email;
      const pseudo = this.user.pseudo;
      const bio = this.user.bio;
      const password = document.getElementById("password").value;
      const newPassword = document.getElementById("newPassword").value;
      let data;

      if (newPassword === "") {
        data = {
          email: email,
          pseudo: pseudo,
          bio: bio,
          password: password,
        };
      } else {
        data = {
          email: email,
          pseudo: pseudo,
          bio: bio,
          password: password,
          newPassword: newPassword,
        };
      }
      this.$axios
        .put("user/modify", data)
        .then(() => {
          this.$router.go();
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.messageError = "Mot de passe invalide";
          }
        });
    },
    deleteProfile() {
      // Supprime l'utilisateur
      const password = document.getElementById("passwordDelete").value;
      this.$axios
        .delete("user/delete", { data: { password: password } })
        .then(() => {
          sessionStorage.removeItem("token");
          delete this.$axios.defaults.headers.common["Authorization"];
          this.$router.push({ name: "Login" });
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.messageError = "Mot de passe invalide";
          }
        });
    },
  },
  mounted() {
    // Récupère les posts et défini le titre
    this.getUser();
    if (this.$route.params.id === "yourProfile") {
      document.title = "Mon profil | Groupomania";
    } else {
      document.title = "Profil d'utilisateur | Groupomania";
    }
  },
  watch: {
    // Permet d'actualiser l'utilisateur si l'on clic sur "Mon profil" pendant qu'on est déja sur une page d'utilisateur
    "$route.params.id": function () {
      this.getUser();
    },
  },
};
</script>

<style scoped lang="scss">
.avatar {
  width: 10em;
  height: 10em;
  object-fit: cover;
}
</style>