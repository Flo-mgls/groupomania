<template>
  <div class="mb-4">
    <form name="createPost">
      <textarea
        name="legend"
        class="form-control"
        cols="130"
        rows="3"
        maxlength="180"
        required
        placeholder="Créer un post"
        v-model="legend"
      ></textarea>
      <div class="custom-file">
        <input
          name="image"
          type="file"
          class="custom-file-input"
          accept="image/gif"
          required
          v-on:change="sendFile($event)"
        />
        <label class="custom-file-label" for="image">Choisir un Gif</label>
      </div>
      <button
        class="btn btn-light form-control text-center"
        type="submit"
        v-on:click.prevent="sendPost()"
      >Publier</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CreatePost",
  props: [],
  data: () => {
    return {
      legend: "",
      image: "",
    };
  },
  methods: {
    sendPost() {
      const formValid = document
        .getElementsByName("createPost")[0]
        .checkValidity();
      if (formValid) {
        this.$emit("post-sent", this.$data);
        document
        .getElementsByName("legend")[0].value = null;
        document
        .getElementsByName("image")[0].value = null;
      }
    },
    sendFile(event) {
      this.$data.image = event.target.files[0];
    },
  },
};
</script>

<style scoped lang="scss">
</style>