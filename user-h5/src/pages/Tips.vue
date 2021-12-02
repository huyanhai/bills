<template>
  <div class="page-tips">
    <div class="content">
      <img src="../static/image/logo.png" alt="" class="logo" />
      <p class="text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  created() {
    const { text } = this.$route.query;
    this.text = decodeURIComponent(text);
  },
};
</script>

<style lang="scss" scope>
.page-tips {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    transform: translateY(-100px);
    .logo {
      width: 150px;
    }
  }
}
</style>
