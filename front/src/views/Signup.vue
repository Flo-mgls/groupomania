<template>
  <div class="container-fluid">
    <NavLogin>
      <SignupInfo v-on:data-sent="updateDataSignup"/>
      <LoginInfo validateText="S'inscrire" v-on:data-sent="updateDataLogin" v-on:request-sent="signup"/>
    </NavLogin>
  </div>
</template>

<script>

import NavLogin from "@/components/NavLogin.vue";
import LoginInfo from "@/components/LoginInfo.vue";
import SignupInfo from "@/components/SignupInfo.vue";

export default {
  name: "Signup",
  components: {
    NavLogin,
    LoginInfo,
    SignupInfo,
  },
  data: () => {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  },
  methods: {
    updateDataSignup(data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
    },
    updateDataLogin(data) {
      this.email = data.email;
      this.password = data.password;
    },
    signup() {
      this.$axios.post('user/signup', this.$data)
      .then( () => {
        this.$axios.post('user/login', this.$data)
        .then(data => {
          this.$axios.defaults.headers.common['Authorization'] = data.data.token;
          console.log(this.$axios.defaults.headers.common['Authorization'])
        })
      })
      .catch(e => console.log(e));
    },
  },
};
</script>