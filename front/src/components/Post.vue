<template>
  <article class="mb-3" :id="idPost">
    <div class="row no-gutters post align-items-center">
      <slot name="postDelete"></slot>
      <div class="col-md-4 order-last">
        <slot name="postGif"></slot>
      </div>
      <div class="col-md-8">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <p class="mb-0 font-weight-bold">
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
              <slot name="postLegend"></slot>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <slot name="createComment"></slot>
      </div>
    </div>
    <div class="border-bottom">
      <div class="row">
        <div class="col-4 col-md-2">
          <i class="fas fa-angle-up fa-lg" :class="reactionUp" v-on:click="sendReactionUp"></i>
          <span class="ml-1">
            <slot name="postUp"></slot>
          </span>
        </div>
        <div class="col-4 col-md-2">
          <i class="fas fa-angle-down fa-lg" :class="reactionDown" v-on:click="sendReactionDown"></i>
          <span class="ml-1">
            <slot name="postDown"></slot>
          </span>
        </div>
        <div class="col-4 col-md-4">
          <p>
            <a class="d-md-none">
              <i class="fas fa-comments" v-on:click="displayCommentInput"></i>
            </a>
            <a class="d-none d-md-block" v-on:click="displayCommentInput">Commenter</a>
          </p>
        </div>
        <div class="col-12 col-md-4">
          <p>
            <small class="text-muted">
              <slot name="postDate"></slot>
            </small>
          </p>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "Post",
  props: ["idPost", "reaction"],
  data: () => {
    return {
      reactionUp: "",
      reactionDown: "",
    };
  },
  methods: {
    displayCommentInput() {
      this.$emit("d-comment-input");
    },
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
.post {
  position: relative;
}
</style>