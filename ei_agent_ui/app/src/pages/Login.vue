<template>
  <view class="page-login">
    <view class="logo">
      <image src="../static/image/logo.png" mode="aspectFit" />
      <text>票盟合伙人</text>
    </view>
    <view class="form">
      <CInput :value.sync="phone" placeholder="请输入手机号" />
      <CInput :value.sync="pass" placeholder="请输入密码" type="password" />
    </view>
    <van-button type="info" class="ui-btn" @click="goIndex" :disabled="disabled">登录</van-button>
    <text class="bottom-name">重庆票盟科技有限公司</text>
  </view>
</template>

<script>
import { post, get } from '../../libs/request';
import CInput from '../components/CInput.vue';
import { checkPhone } from '../../libs/utils';
import { userLogin } from '../../libs/auth';

export default {
  data() {
    return {
      title: 'Hello',
      phone: '',
      pass: '',
      disabled: false,
      loginRes: '',
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
      if (!checkPhone(this.phone)) {
        return uni.showToast({
          title: '手机号输入不正确',
          icon: 'none',
          duration: 2000,
        });
      }
      if (!this.pass) {
        return uni.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000,
        });
      }
      vm.disabled = true;
      uni.getUserProfile({
        desc: '授权',
        success: async infoRes => {
          let authData = Object.assign(infoRes, vm.loginRes);
          const { code, data } = await post(`agent/login`, {
            code: authData.code,
            encryptedData: authData.encryptedData,
            iv: authData.iv,
            phone: this.phone,
            pass: this.pass,
          });
          if (code === 0) {
            uni.setStorageSync('authCode', data);
            uni.switchTab({
              url: 'Index',
            });
          }
          if (code === 6) {
            uni.navigateTo({
              url: `Hehuoren?phone=${this.phone}`,
            });
          }
          vm.disabled = false;
        },
        fail(err) {
          vm.disabled = false;
          uni.showToast({
            title: '授权失败',
          });
        },
      });
    },
  },
  components: {
    CInput,
  },
  styleIsolation: 'shared',
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
    align-items: center;
    flex-direction: column;
    justify-content: center;
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
