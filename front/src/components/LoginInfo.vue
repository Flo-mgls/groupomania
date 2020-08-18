<template>
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-lg-4 col-md-8 offset-lg-4 offset-md-2">
        <input class="form-control text-center" type="email" placeholder="Votre email" id="email" v-model="email" v-on:input="sendData"/>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col-lg-4 col-md-8 offset-lg-4 offset-md-2">
        <input class="form-control text-center" type="password" placeholder="Votre mot de passe" id="password" v-model="password" v-on:input="sendData"/>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col-lg-4 col-md-8 offset-lg-4 offset-md-2">
        <button class="btn btn-light form-control text-center" type="submit" v-on:click="sendRequest">{{ validateText }}</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "LoginInfo",
  props: ['validateText'],
  data: () => {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    sendData() {
      this.$emit('data-sent', this.$data);
    },
    sendRequest() {
      this.$emit('request-sent');
    }
  }
};
</script>

<style scoped lang="scss">
</style>
