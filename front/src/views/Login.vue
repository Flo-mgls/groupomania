<template>
  <div class="container">
    <navLogin>
      <LoginInfo validateText="Se connecter " />
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
};
</script>
