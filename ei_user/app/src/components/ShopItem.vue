<template>
  <view class="card-item" @click="$emit('itemClick')">
    <image src="../static/logo.png"></image>
    <view class="more-info">
      <view class="name">重庆淘电科技有限公司</view>
      <view class="time">2021-07-20 16:13:12</view>
    </view>
    <view class="more" v-if="types !== 0">
      <view class="type">
        {{ types === "1" ? "开票成功" : "冲红成功" }}
      </view>
      <view class="money">￥10.0</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    types: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.card-item {
  background: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative;
  image {
    width: 80rpx;
    height: 80rpx;
  }
  .more-info {
    margin-left: 30rpx;
    .name {
      font-size: 28rpx;
      margin-bottom: 10rpx;
    }
    .time {
      font-size: 22rpx;
      color: rgba($color: #000000, $alpha: 0.5);
    }
  }
  .more {
    .type {
      position: absolute;
      right: 30rpx;
      top: 30rpx;
      font-size: 24rpx;
      color: rgb(202, 70, 70);
      font-weight: bold;
    }
    .money {
      position: absolute;
      right: 30rpx;
      bottom: 30rpx;
      font-size: 24rpx;
      color: rgb(202, 70, 70);
    }
  }
}
</style>
