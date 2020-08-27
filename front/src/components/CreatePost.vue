<!-- COMPONENT CREATEPOST - Création d'un post -->

<template>
  <div class="mb-4">
    <form name="createPost">
      <!-- Textarea du post -->
      <textarea
        name="legend"
        class="form-control"
        cols="130"
        rows="3"
        maxlength="180"
        required
        placeholder="Créer un post"
        aria-label="Ecrire un post"
        v-model="legend"
      ></textarea>
      <!-- Fin -->
      <!-- Sélection du Gif -->
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
      <!-- Fin -->
      <!-- Bouton pour le publier -->
      <button
        class="btn btn-light form-control text-center"
        type="submit"
        v-on:click.prevent="sendPost()"
      >Publier</button>
      <!-- Fin -->
    </form>
  </div>
</template>

<script>
export default {
  name: "CreatePost",
  data: () => {
    return {
      legend: "", // Corps du post
      image: "", // Gif du post
    };
  },
  methods: {
    sendPost() { // Envois du corps au parent pour traiter l'envois à l'API
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
    sendFile(event) { // Envois du Gif au parent pour traiter l'envois à l'API
      this.$data.image = event.target.files[0];
    },
  },
};
</script>