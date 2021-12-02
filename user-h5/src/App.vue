<template>
  <router-view />
</template>
<script>
import { session } from "./libs/storage";

export default {
  created() {
    let { token } = this.$route.query;
    if (token) {
      session.set("token", token);
    }
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
