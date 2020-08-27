<!-- COMPONENT CREATECOMMENT - Création d'un commentaire -->

<template>
  <form name="formComment">
    <!-- Textarea du commentaire -->
    <textarea
      name="comment"
      class="form-control"
      cols="130"
      rows="2"
      required
      placeholder="Créer un commentaire"
      aria-label="Ecrire un commentaire"
      v-model="body"
      v-on:input="sendComment"
    ></textarea>
    <!-- Fin -->
    <!-- Bouton pour le publier -->
    <slot></slot>
    <!-- fin -->
  </form>
</template>

<script>
export default {
  name: "CreateComment",
  data: () => {
    return {
      body: "",
    };
  },
  methods: {
    sendComment() { // Envois du corps du commentaire au parent pour traiter l'envoi à l'api
      this.$emit("comment-sent", this.$data);
    },
  },
};
</script>