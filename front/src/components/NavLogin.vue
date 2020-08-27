<!-- COMPONENT NAVLOGIN - Nav et Header des pages login et signup -->

<template>
  <header>
    <!-- Logo Groupomania -->
    <h1>
      <img class="img-fluid" alt="Groupomania" src="../assets/logo.svg" />
    </h1>
    <!-- Fin -->
    <!-- Menu de navigation -->
    <nav>
      <router-link to="/">Se connecter</router-link> |
      <router-link to="/Signup">S'inscrire</router-link>
    </nav>
    <!-- Fin -->
  </header>
</template>

<script>
export default {
  name: "NavLogin",
};
</script>

<style scoped lang="scss">
header {
  margin-top: 10em;
}
</style>