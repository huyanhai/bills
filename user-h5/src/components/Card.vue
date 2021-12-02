<template>
  <div class="m-card">
    <div class="title" v-if="title">
      <div class="col-l">{{ title }}</div>
      <div class="col-r" v-if="titleRight">{{ titleRight }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    titleRight: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.m-card {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  .title {
    text-align: left;
    font-size: 15px;
    display: block;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
    line-height: 20px;
    .col-r {
      color: red;
      font-size: 12px;
    }
  }
}
</style>
