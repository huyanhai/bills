<template>
  <view class="page-login">
    <view class="logo">
      <image src="../static/image/logo.png" mode="aspectFit" />
      <text>票盟商户端</text>
    </view>
    <view class="form">
      <CInput :value.sync="phone" placeholder="请输入手机号" />
      <CInput :value.sync="password" placeholder="请输入密码" type="password" />
    </view>
    <van-button type="info" class="ui-btn" @click="goIndex" :disabled="disabled">登录</van-button>
    <text class="bottom-name">重庆票盟科技有限公司</text>
  </view>
</template>

<script>
import CInput from "../components/CInput.vue";
import { post } from "../../libs/request";
import { checkPhone } from "../../libs/utils";
import { userLogin } from "../../libs/auth";

export default {
  data() {
    return {
      title: "Hello",
      phone: "",
      password: "",
      disabled: false,
      loginRes: "",
    };
  },
  onShow() {
    const vm = this;
    uni.login({
      success: function(loginRes) {
        vm.loginRes = loginRes;
      },
    });
  },
  methods: {
    async goIndex() {
      const vm = this;
      if (!this.phone || !this.password) {
        return uni.showToast({
          title: "请输入手机号或密码",
          duration: 2000,
          icon: "none",
        });
      }
      if (!checkPhone(this.phone)) {
        return uni.showToast({
          title: "手机号格式错误",
          duration: 2000,
          icon: "none",
        });
      }
      vm.disabled = true;
      uni.getUserProfile({
        desc: "授权",
        success: async (infoRes) => {
          let authData = Object.assign(infoRes, vm.loginRes);
          const { code, data } = await post(`site/login`, {
            code: authData.code,
            encryptedData: authData.encryptedData,
            iv: authData.iv,
            phone: this.phone,
            pass: this.password,
          });
          if (code === 0) {
            uni.setStorageSync("authCode", data);
            uni.reLaunch({
              url: "Index",
            });
          }
          vm.disabled = false;
        },
        fail(err) {
          vm.disabled = false;
          uni.showToast({
            title: "授权失败",
          });
        },
      });
    },
  },
  components: {
    CInput,
  },
};
</script>

<style lang="scss">
.page-login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  .bottom-name {
    position: absolute;
    bottom: 60rpx;
    text-align: center;
    width: 100%;
    font-size: 24rpx;
  }
  .logo {
    margin-top: 30rpx;
    text-align: center;
    display: flex;
    flex-direction: column;
    image {
      height: 100rpx;
      margin: 100rpx 0;
    }
  }
  .form {
    width: 100%;
    margin: 60rpx 0;
    box-sizing: border-box;
    padding: 0 30rpx;
    .ui-input {
      margin-bottom: 30rpx;
      display: block;
    }
  }
  .ui-btn {
    width: 100%;
    display: block;
    padding: 30rpx;
    box-sizing: border-box;
    .van-button {
      width: 100%;
    }
  }
}
</style>
