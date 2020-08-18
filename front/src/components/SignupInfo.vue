<template>
  <div class="container">
    <div class="row">
      <div class="col-2 offset-4">
        <input class="form-control text-center" type="text" placeholder="Votre prénom" id="firstName" />
      </div>
      <div class="col-2">
        <input class="form-control text-center" type="text" placeholder="Votre nom" id="lastName" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupInfo",
  props: [],
};
</script>

<style scoped lang="scss">
</style>
