<template>
  <view class="tabs">
    <view class="tab-hd">
      <view class="title" :style="{ width: `calc(100% / ${titleList.length})` }" :class="{ active: active === item.value }" v-for="item in titleList" :key="item.value" @click="tabItemChange(item)">
        {{ item.name }}
      </view>
    </view>
    <scroll-view class="tab-bd" scroll-y>
      <slot></slot>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    titleList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      active: 1,
    };
  },
  methods: {
    tabItemChange(item) {
      this.active = item.value;
      this.$emit("itemChange", item);
    },
  },
};
</script>

<style lang="scss">
.tabs {
  height: 100vh;
  background: #eee;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .tab-hd {
    display: flex;
    align-items: center;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    flex: 0 0 auto;
    background: #fff;
    .title {
      width: calc(100% / 3);
      text-align: center;
      position: relative;
      color: rgba($color: #000000, $alpha: 0.6);
      cursor: pointer;
      &.active {
        color: #1989fa;
        &::before {
          position: absolute;
          width: 100rpx;
          height: 4rpx;
          background: #1989fa;
          display: block;
          content: "";
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .tab-bd {
    flex: 1 0 auto;
    min-height: 20vh;
    box-sizing: border-box;
    padding: 30rpx 30rpx 98rpx 30rpx;
  }
}
</style>
