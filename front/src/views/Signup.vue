<template>
  <div class="container">
    <NavLogin>
      <SignupInfo />
      <LoginInfo validateText="S'inscrire" />
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
};
</script>