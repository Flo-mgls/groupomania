<!-- COMPONENT NAVFEED - Nav et Header des pages principales -->

<template>
  <header class="mb-1 mb-md-3">
    <nav class="navbar navbar-expand-lg navbar-light">
      <!-- Logo Groupomania -->
      <h1 class="navbar-brand w-50">
        <router-link to="/Feed">
          <img class="img-fluid" alt="Groupomania" src="../assets/logo-feed.svg" role="link" />
        </router-link>
      </h1>
      <!-- Fin -->
      <!-- Bouton responsive pour dévoiler le menu -->
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Afficher navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    <!-- Fin -->
    <!-- Menu de navigation -->
      <div
        class="collapse navbar-collapse align-self-end justify-content-end"
        id="navbarNavAltMarkup"
      >
        <div class="navbar-nav">
          <p class="mr-lg-4 text-right">
            <router-link :to="{ name: 'Profile', params: {id: 'yourProfile' } }">Mon profil</router-link>
          </p>
          <p class="text-right">
            <router-link to="/">Se déconnecter</router-link>
          </p>
        </div>
      </div>
      <!-- Fin -->
    </nav>
  </header>
</template>

<script>
export default {
  name: "NavFeed",
};
</script>