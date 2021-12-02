<template>
  <view class="page-index">
    <Card class="user-op">
      <van-grid column-num="2" :border="false" class="c-tabs">
        <van-grid-item :icon="require('../static/image/scan.png')" text="扫码开票" @click="onScanCode"> </van-grid-item>
        <van-grid-item :icon="require('../static/image/invoice.png')" text="发票抬头" @click="goNull"> </van-grid-item>
      </van-grid>
    </Card>
    <van-cell is-link center @click="goPath('MyCode')">
      <template #icon>
        <image :src="require('../static/image/my_invoice.png')" mode="" class="cell-icon" />
      </template>
      <template #title>
        <span class="custom-title">我的发票</span>
      </template>
    </van-cell>
    <ad class="ad" unit-id="adunit-efa6b966bc742131"></ad>
  </view>
</template>

<script>
import Card from "../components/Card.vue";
import { get } from "../../libs/request";
import { userLogin } from "../../libs/auth";

export default {
  data() {
    return {
      skip: false,
      userId: "",
      userInfo: {},
    };
  },
  async onLoad() {
    // let authCode = uni.getStorageSync("authCode");
    // if (!authCode) {
    //   // uni.showToast({
    //   //   title: "登录超时，请重新登录",
    //   //   icon: "none",
    //   //   duration: 2000,
    //   // });
    //   // uni.reLaunch({
    //   //   url: "/pages/Login",
    //   // });
    //   await userLogin()
    // }
  },
  methods: {
    goNull() {
      uni.navigateTo({
        url: "MyTaiTou",
      });
    },
    onScanCode() {
      let that = this;
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ["qrCode", "barCode"],
        success: function(res) {
          let url = res.result;
          let code = url.split("/") || [];
          let codeId = code[code.length - 1];
          that.checkId(codeId);
        },
      });
    },
    async checkId(codeId) {
      const { code, msg } = await get(`wechat/get/code/${codeId}`, {
        codeId: codeId,
      });
      uni.navigateTo({
        url: `OpenCard?codeId=${codeId}`,
      });
      // if (code === 0) {
      //   uni.navigateTo({
      //     url: `OpenCard?codeId=${codeId}`,
      //   });
      // } else {
      //   uni.showToast({
      //     title: msg,
      //     duration: 2000,
      //     icon: "none",
      //   });
      // }
    },
    goPath(path) {
      uni.navigateTo({
        url: path,
      });
    },
  },
  components: {
    Card,
  },
};
</script>

<style lang="scss">
.page-index {
  min-height: 100vh;
  padding: 30rpx;
  background: #eee;
  .user-op {
    margin-bottom: 30rpx;
    display: block;
  }
  .cell-icon {
    width: 30rpx;
    height: 30rpx;
    margin-right: 20rpx;
  }
  .ad {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60rpx;
    left: 0;
  }
}
</style>
