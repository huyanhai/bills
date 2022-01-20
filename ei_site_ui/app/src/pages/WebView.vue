<template>
  <web-view class="webview" :webview-styles="webviewStyles" :src="url"></web-view>
</template>

<script>
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: '#FF3333',
        },
      },
      url: '',
    };
  },
  onLoad() {
    const token = String(uni.getStorageSync('authCode'));
    this.url = `https://pmy.funku.cn/agent/api/agent/wechat/auth/${token}`;
  },
};
</script>

<style>
.webview {
  width: 100%;
  height: 100%;
}
</style>
