<template>
  <div class="mb-4">
    <textarea class="form-control" name="post" cols="130" rows="3" placeholder="Créer un post" v-model="legend"></textarea>
    <div class="custom-file">
      <input type="file" class="custom-file-input" v-on:change="sendFile($event)" />
      <label class="custom-file-label" for="customFile">Choisir un Gif</label>
    </div>
    <button class="btn btn-light form-control text-center" type="submit" v-on:click="sendPost()">Publier</button>
  </div>
</template>

<script>
export default {
  name: "CreatePost",
  props: [],
  data: () => {
    return {
      legend: '',
      image: ''
    }
  },
  methods: {
    sendPost() {
      this.$emit('post-sent', this.$data);
    },
    sendFile(event) {
      this.$data.image = event.target.files[0];
    }
  }
};
</script>

<style scoped lang="scss">
</style>