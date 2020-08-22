<template>
  <div class="my-1">
    <form name="formComment">
      <textarea
        name="comment"
        class="form-control"
        cols="130"
        rows="2"
        required
        placeholder="Créer un commentaire"
        v-model="body"
        v-on:input="sendComment"
      ></textarea>
      <slot></slot>  
    </form>
  </div>
</template>

<script>
export default {
  name: "CreateComment",
  props: [],
  data: () => {
    return {
      body: ""
    };
  },
  methods: {
    sendComment() {
        this.$emit("comment-sent", this.$data);
    }
  },
};
</script>

<style scoped lang="scss">
</style>