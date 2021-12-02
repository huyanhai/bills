<template>
  <view class="m-card" :style="{'padding': paddingTop ? '30rpx;' : '0 30rpx;'}">
    <view class="title" v-if="title">{{ title }}</view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    paddingTop: {
      type: Boolean,
      default: true
    }
  },
};
</script>

<style lang="scss">
.m-card {
  background: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  .title {
    text-align: left;
    font-size: 30rpx;
    display: block;
    border-bottom: 2rpx solid #eee;
    padding-bottom: 30rpx;
  }
}
</style>
