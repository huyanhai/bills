<template>
  <div class="login-wrapper">
    <login-header />

    <div class="login-container">
      <div class="title-container">
        <div class="sub-title"></div>
      </div>
      <login v-if="type === 'login'" />
    </div>

    <footer class="copyright">Copyright @ 2021-2022 Tencent. All Rights Reserved</footer>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import Login from './components/Login.vue';
import LoginHeader from './components/Header.vue';

export default defineComponent({
  name: 'LoginIndex',
  components: {
    Login,
    LoginHeader,
  },
  setup() {
    const type = ref('login');
    const switchType = (val: string) => {
      type.value = val;
    };

    return {
      type,
      switchType,
    };
  },
});
</script>
<style lang="less">
@import url('./index.less');
</style>
