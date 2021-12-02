<template>
  <view class="page-search">
    <van-radio-group @change="onChange" :value="value">
      <van-radio :name="item.taxNo" :data-list="item" v-for="item in list" :key="item.taxNo">
        <view class="box">
          <view class="ui-title">{{ item.title }}</view>
          <view class="ui-text">{{ item.address }}</view>
        </view>
      </van-radio>
    </van-radio-group>
    <van-button class="m-button" type="info" @click="onSubmit"> 确定 </van-button>
  </view>
</template>

<script>
import { get } from "../../libs/request";

export default {
  data() {
    return { companyCloudTitle: "", list: [], value: "" };
  },
  onLoad(e) {
    const { companyCloudTitle } = e;
    if (companyCloudTitle) {
      this.companyCloudTitle = companyCloudTitle;
      this.getData();
    }
  },
  methods: {
    async getData() {
      const { data } = await get(`wechat/get/zyh/companyCloudTitle?companyTitle=${this.companyCloudTitle}`, {
        companyTitle: this.companyCloudTitle,
      });
      if (data) {
        this.list = data;
      }
    },
    onChange(e) {
      this.value = e.detail;
      for (const item of this.list) {
        if (item.taxNo === this.value) {
          uni.setStorageSync("taitou", item);
        }
      }
    },
    onSubmit() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss">
.page-search {
  box-sizing: border-box;
  padding: 30rpx;
  .m-button {
    margin-top: 60rpx;
    display: block;
    button {
      width: 100%;
    }
  }
  .van-radio__label {
    width: 100%;
  }
  .box {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    padding: 30rpx 0;
  }
  .ui-title {
    font-size: 28rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ui-text {
    font-size: 24rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba($color: #000000, $alpha: 0.5);
  }
}
</style>
