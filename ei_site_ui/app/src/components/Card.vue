<template>
  <view class="m-card">
    <view class="title" v-if="title" @click="$emit('titleClick')">
      <view class="col-l">{{ title }}</view>
      <view class="col-r" v-if="titleRight">{{ titleRight }}</view>
    </view>
    <slot></slot>
  </view>
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
  border-radius: 10rpx;
  padding: 30rpx;
  .title {
    text-align: left;
    font-size: 30rpx;
    display: block;
    border-bottom: 2rpx solid #eee;
    padding-bottom: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .col-r {
      color: red;
      font-size: 24rpx;
    }
  }
}
</style>
