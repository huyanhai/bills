<template>
  <view class="page-login">
    <view class="logo">
      <image src="../static/image/logo.png" mode="aspectFit" />
      <!-- <text>淘电发票助手商户</text> -->
    </view>
    <!-- <view class="form">
      <CInput :value.sync="phone" placeholder="请输入手机号" />
      <CInput :value.sync="pass" placeholder="请输入密码" type="password" />
    </view> -->
    <van-button
      class="ui-btn"
      type="info"
      @getuserinfo="onGetAuthorize('user')"
      open-type="getUserInfo"
    >
      授权登录
    </van-button>
  </view>
</template>

<script>
import { get } from "../../libs/request";
import CInput from "../components/CInput.vue";
import { userLogin } from "../../libs/auth";
export default {
  data() {
    return {
      title: "Hello",
      phone: "",
      pass: "",
    };
  },
  async onLoad() {
    await userLogin();
  },
  methods: {
    async onGetAuthorize() {
      await userLogin();
    },
  },
  components: {
    CInput,
  },
  styleIsolation: "shared",
};
</script>

<style lang="scss">
.page-login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  .logo {
    margin-top: 30rpx;
    text-align: center;
    image {
      height: 100rpx;
      margin: 100rpx 0;
    }
  }
  .form {
    width: 100%;
    margin: 60rpx 0;
    box-sizing: border-box;
    padding: 0 60rpx;
    .ui-input {
      margin-bottom: 30rpx;
      display: block;
    }
  }
  .ui-btn {
    width: 100%;
    display: block;
    padding: 30rpx 60rpx;
    box-sizing: border-box;
    .van-button {
      width: 100%;
    }
  }
}
</style>
