<template>
  <header>
    <h1>
      <img class="img-fluid" alt="Groupomania" src="../assets/logo.svg" />
    </h1>
    <nav>
      <router-link to="/">Se connecter</router-link>|
      <router-link to="/Signup">S'inscrire</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: "NavLogin",
  props: [],
};
</script>

<style scoped lang="scss">
</style>