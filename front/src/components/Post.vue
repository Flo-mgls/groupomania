<template>
  <article class="mb-3">
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
    <div class="border-bottom">
      <div class="row">
        <div class="col-4 col-md-2">
          <i class="fas fa-angle-up fa-lg"></i>
          <span class="ml-1">
            <slot name="postUp"></slot>
          </span>
        </div>
        <div class="col-4 col-md-2">
          <i class="fas fa-angle-down fa-lg"></i>
          <span class="ml-1">
            <slot name="postDown"></slot>
          </span>
        </div>
        <div class="col-4 col-md-4">
          <p>
            <router-link class="d-md-none" to="/"><i class="fas fa-comments"></i></router-link>
            <router-link class="d-none d-md-block" to="/">Commenter</router-link>
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
  props: [],
};
</script>

<style scoped lang="scss">
i:hover {
  color: rgb(233, 68, 38);
}
.post {
 position: relative;
}
</style>