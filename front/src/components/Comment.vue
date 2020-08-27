<!-- COMPONENT COMMENT - Commentaires -->

<template>
  <article class="mb-3">
    <slot name="commentDelete"></slot>
    <div class="row no-gutters align-items-center">
      <div class="col-12">
        <div class="container">
          <!-- Informations sur l'user -->
          <header class="row">
            <div class="col-12">
              <p class="mb-0 font-weight-bold pointer" role="link" @click="goToProfile(idUser)">
                <slot name="userAvatar"></slot>
                <slot name="userName"></slot>
                <span class="text-muted ml-1 font-weight-normal">
                  <slot name="userPseudo"></slot>
                </span>
              </p>
            </div>
          </header>
          <!-- Fin -->
          <!-- Corps du commentaire -->
          <div class="row text-center pt-3">
            <p class="col-12 h5-lg">
              <slot name="commentBody"></slot>
            </p>
          </div>
          <!-- Fin -->
        </div>
      </div>
    </div>
    <!-- Reactions au commentaire et date -->
    <footer class="row border-bottom">
      <div class="col-6 col-md-2">
        <i
          class="fas fa-angle-up fa-lg"
          aria-hidden="true"
          title="Aimer le post"
          role="button"
          :class="reactionUp"
          v-on:click="sendReactionUp"
        ></i>
        <span class="sr-only">Aimer le commentaire</span>
        <span class="ml-1">
          <slot name="commentUp"></slot>
        </span>
      </div>
      <div class="col-6 col-md-2">
        <i
          class="fas fa-angle-down fa-lg"
          aria-hidden="true"
          title="Ne pas aimer le post"
          role="button"
          :class="reactionDown"
          v-on:click="sendReactionDown"
        ></i>
        <span class="sr-only">Ne pas aimer le commentaire</span>
        <span class="ml-1">
          <slot name="commentDown"></slot>
        </span>
      </div>
      <div class="col-12 col-md-4 offset-md-4">
        <p>
          <small class="text-muted">
            <slot name="commentDate"></slot>
          </small>
        </p>
      </div>
    </footer>
  </article>
</template>

<script>
export default {
  name: "Comment",
  props: ["idUser", "reaction"],
  data: () => {
    return {
      reactionUp: "", // Nombre de réactions positives
      reactionDown: "", // Nombre de réactions négatives
    };
  },
  methods: {
    sendReactionUp() {
      // Envois de la réaction positive au parent pour traiter l'envoi à l'api
      if (this.reaction === 1) {
        this.$emit("reaction-none");
      }
      this.$emit("reaction-up");
    },
    sendReactionDown() {
      // Envois de la réaction négative au parent pour traiter l'envoi à l'api
      if (this.reaction === -1) {
        this.$emit("reaction-none");
      }
      this.$emit("reaction-down");
    },
    updateReaction() {
      // Update de la réaction au niveau visuelle avec CSS
      if (this.reaction === 1) {
        this.reactionUp = "reactionActive";
        this.reactionDown = "reactionNone";
      } else if (this.reaction === -1) {
        this.reactionUp = "reactionNone";
        this.reactionDown = "reactionActive";
      } else {
        this.reactionUp = "reactionNone";
        this.reactionDown = "reactionNone";
      }
    },
    goToProfile(idUser) {
      // Route dynamique menant au profil de l'utilisateur ayant crée le commentaire
      this.$router.push({ name: "Profile", params: { id: idUser } });
    },
  },
  mounted() {
    // On update la réaction au niveau visuelle
    this.updateReaction();
  },
  updated() {
    // On update la réaction au niveau visuelle
    this.updateReaction();
  },
};
</script>

<style scoped lang="scss">
article {
  position: relative;
  i {
    &.reactionActive {
      color: rgb(233, 68, 38);
    }
    &.reactionNone {
      color: #2c3e50;
    }
    &:hover {
      color: rgb(233, 68, 38);
    }
  }
  .pointer {
    cursor: pointer;
  }
}
</style>