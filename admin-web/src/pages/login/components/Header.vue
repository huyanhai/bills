<template>
  <header class="login-header"></header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const toggleSettingPanel = () => {
      store.commit('setting/toggleSettingPanel', true);
    };

    const navToGitHub = () => {
      window.open('https://github.com/tencent/tdesign-vue-next-starter');
    };

    const navToHelper = () => {
      window.open('http://tdesign.tencent.com/starter/docs/get-started');
    };

    return {
      toggleSettingPanel,
      navToGitHub,
      navToHelper,
    };
  },
});
</script>

<style lang="less" scoped>
@import '@/style/variables.less';
.login-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(5px);
  color: @text-color-primary;

  .logo {
    height: 30px;
  }

  .operations-container {
    display: flex;
    align-items: center;
    .t-button {
      margin-left: 16px;
    }

    .icon {
      height: 20px;
      width: 20px;
      padding: 6px;
      box-sizing: content-box;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
