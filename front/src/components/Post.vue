<!-- COMPONENT POST - Posts -->

<template>
  <article class="mb-3" :id="idPost">
    <slot name="postDelete"></slot>
    <div class="row no-gutters post align-items-center border-bottom pb-1">
      <div class="col-md-8">
        <div class="container mt-1">
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
          <!-- Corps du post -->
          <div class="row text-center pt-3" :class="cursor" role="link" @click="goToFeedID(idPost)">
            <p class="col-12 h5-lg">
              <slot name="postLegend"></slot>
            </p>
          </div>
          <!-- Fin -->
        </div>
      </div>
      <!-- Gif du post -->
      <div class="col-md-4" :class="cursor" role="link" @click="goToFeedID(idPost)">
        <slot name="postGif"></slot>
      </div>
      <!-- Fin -->
    </div>
    <!-- Création d'un commentaire -->
    <div class="row">
      <div class="col-12">
        <slot name="createComment"></slot>
      </div>
    </div>
    <!-- Fin -->
    <!-- Reactions au commentaire et date -->
    <footer class="row">
      <div class="col-4 col-md-2">
        <i
          class="fas fa-angle-up fa-lg"
          aria-hidden="true"
          title="Aimer le post"
          role="button"
          :class="reactionUp"
          v-on:click="sendReactionUp"
        ></i>
        <span class="sr-only">Aimer le post</span>
        <span class="ml-1">
          <slot name="postUp"></slot>
        </span>
      </div>
      <div class="col-4 col-md-2">
        <i
          class="fas fa-angle-down fa-lg"
          aria-hidden="true"
          title="Ne pas aimer le post"
          role="button"
          :class="reactionDown"
          v-on:click="sendReactionDown"
        ></i>
        <span class="sr-only">Ne pas aimer le post</span>
        <span class="ml-1">
          <slot name="postDown"></slot>
        </span>
      </div>
      <div class="col-4 col-md-4">
        <p>
          <a class="d-md-none">
            <i
              class="fas fa-comments"
              aria-hidden="true"
              title="Commmenter le post"
              role="button"
              v-on:click="displayCommentInput"
            ></i>
            <span class="sr-only">Commenter le post</span>
          </a>
          <a class="d-none d-md-block pointer" v-on:click="displayCommentInput">Commenter</a>
        </p>
      </div>
      <div class="col-12 col-md-4">
        <p>
          <small class="text-muted">
            <slot name="postDate"></slot>
          </small>
        </p>
      </div>
    </footer>
    <!-- Fin -->
  </article>
</template>

<script>
export default {
  name: "Post",
  props: ["idPost", "idUser", "reaction"],
  data: () => {
    return {
      reactionUp: "", // Nombre de réactions positives
      reactionDown: "", // Nombre de réactions négatives
      cursor: "pointer" // Défini le pointeur que doit avoir le corps et gif du post
    };
  },
  methods: {
    displayCommentInput() {
      // Envois de la requête pour dévoiler l'input pour créer un commentaire
      this.$emit("d-comment-input");
    },
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
    goToFeedID(idPost) {
      // Route dynamique menant au post spécifique et ses commentaires
      if (idPost != undefined) {
        this.$router.push({ name: "FeedID", params: { id: idPost } });
      }
    },
    goToProfile(idUser) {
      // Route dynamique menant au profil de l'utilisateur ayant crée le commentaire
      this.$router.push({ name: "Profile", params: { id: idUser } });
    },
  },
  mounted() {
    // On update la réaction au niveau visuelle ainsi que le pointeur
    this.updateReaction();
    if (this.$route.name === "Feed") {
      this.cursor = "pointer";
    } else {
      this.cursor = "default";
    }
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
  background-color: #fffafa;
  border-radius: 1em;
  box-shadow: 1px 1px 5px;
  .gif-img {
    border-radius: 0 1em 0 1em;
    @media (max-width: 768px) {
      border-radius: 0;
    }
  }
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