<template>
    <header>
      <img class="img-fluid" alt="Groupomania logo" src="../assets/logo.svg" />
      <nav>
        <router-link to="/">Se connecter </router-link>|
        <router-link to="/Signup">S'inscrire</router-link>
      </nav>
      <slot></slot>
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