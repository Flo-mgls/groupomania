<template>
  <div class="container">
    <div class="row my-2">
      <div class="col-4 offset-4">
        <input class="form-control text-center" type="email" placeholder="Votre email" id="email" />
      </div>
    </div>
    <div class="row my-2">
      <div class="col-4 offset-4">
        <input class="form-control text-center" type="password" placeholder="Votre mot de passe" id="password" />
      </div>
    </div>
    <div class="row my-2">
      <div class="col-4 offset-4">
        <button class="btn btn-light form-control text-center" type="submit">{{ validateText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginInfo",
  props: ['validateText'],
};
</script>

<style scoped lang="scss">
input {
  
}
</style>
