<template>
  <article class="mb-3">
    <slot name="commentDelete"></slot>
    <div class="row no-gutters align-items-center">
      <div class="col-12">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <p class="mb-0 font-weight-bold" role="link" @click="goToProfile(idUser)">
                <slot name="userAvatar"></slot>
                <slot name="userName"></slot>
                <span class="text-muted ml-1 font-weight-normal">
                  <slot name="userPseudo"></slot>
                </span>
              </p>
            </div>
          </div>
          <div class="row text-center pt-3">
            <p class="col-12 h5-lg">
              <slot name="commentBody"></slot>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="border-bottom">
      <div class="row">
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
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "Comment",
  props: ["idUser", "reaction"],
  data: () => {
    return {
      reactionUp: "",
      reactionDown: "",
    };
  },
  methods: {
    sendReactionUp() {
      if (this.reaction === 1) {
        this.$emit("reaction-none");
      }
      this.$emit("reaction-up");
    },
    sendReactionDown() {
      if (this.reaction === -1) {
        this.$emit("reaction-none");
      }
      this.$emit("reaction-down");
    },
    updateReaction() {
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
      this.$router.push({ name: "Profile", params: { id: idUser } });
    },
  },
  mounted() {
    this.updateReaction();
  },
  updated() {
    this.updateReaction();
  },
};
</script>

<style scoped lang="scss">
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
article {
  position: relative;
}
</style>