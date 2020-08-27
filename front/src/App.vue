<template>
  <div id="app">
    <div class="container-fluid container-md">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fafbff;
  min-height: 100%;
  a {
    color: #2c3e50;
  }
  nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: rgb(233, 68, 38);
    }
  }
}
}
</style>
