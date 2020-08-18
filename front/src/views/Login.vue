<template>
  <div class="container-fluid">
    <navLogin>
      <LoginInfo validateText="Se connecter" v-on:data-sent="updateData" v-on:request-sent="login"/>
    </navLogin>
  </div>
</template>

<script>

import NavLogin from "@/components/NavLogin.vue";
import LoginInfo from "@/components/LoginInfo.vue";

export default {
  name: "Login",
  components: {
    NavLogin,
    LoginInfo,
  },
  data: () => {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    updateData(data) {
      this.email = data.email;
      this.password = data.password;
    },
    login() {
      this.$axios.post('user/login', this.$data)
      .then(data => {
        this.$axios.defaults.headers.common['Authorization'] = data.data.token;
        })
      .catch(e => console.log(e));
    },
  }
};
</script>
