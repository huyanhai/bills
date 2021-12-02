<template>
  <view class="page-login">
    <view class="form">
      <CInput :value.sync="form.agentName" placeholder="请输入姓名" label="姓名" />
      <CInput :value.sync="form.phone" placeholder="请输入手机号" label="手机号">
        <view class="get link" @click="getMsg" v-if="!showCount">{{ msg }}</view>
        <view class="get" v-else>{{ time }}s</view>
      </CInput>
      <CInput :value.sync="form.smsCode" placeholder="请输入验证码" label="验证码"> </CInput>
      <CInput
        :value.sync="form.password"
        placeholder="请输入合伙人密码"
        label="密码"
        type="password"
      />
    </view>
    <van-button type="info" class="ui-btn" @click="submit">创建</van-button>
    <van-dialog
      use-slot
      :show="show"
      show-cancel-button
      :overlay="true"
      @cancel="show = false"
      @confirm="confirm"
      :before-close="beforeClose"
    >
      <view class="dialog-box">
        <CInput
          :value.sync="validateCode"
          placeholder="请输入验证码"
          label="图形验证码"
          use-button-slot
        >
          <image :src="imgUrl" class="img" @click="changImg"></image>
        </CInput>
      </view>
    </van-dialog>
  </view>
</template>

<script>
import { post, get } from '../../libs/request';
import CInput from '../components/CInput.vue';
import { BASE_URL } from '../../config/index';
import { checkPhone } from '../../libs/utils';
const apps = {
  data() {
    return {
      form: {
        agentName: '',
        phone: '',
        password: '',
        smsCode: '',
      },
      validateCode: '',
      show: false,
      src: '',
      msg: '获取验证码',
      time: 60,
      showCount: false,
      imgUrl: ``,
      timer: null,
      canClose: false,
    };
  },
  onload() {},
  methods: {
    changImg() {
      const time = new Date().valueOf();
      this.imgUrl = `${BASE_URL}p/permit/authcode/${this.form.phone}/?${time}`;
    },
    countDown() {
      const vm = this;
      this.timer = setInterval(() => {
        if (vm.time <= 1) {
          vm.time = 60;
          vm.showCount = false;
          clearInterval(this.timer);
        } else {
          vm.showCount = true;
          vm.time--;
        }
      }, 1000);
    },
    async confirm() {
      let { code, msg } = await get(`p/validate-code`, {
        validateCode: this.validateCode,
        mobile: this.form.phone,
      });
      if (code === 0) {
        this.getCode();
        this.show = false;
        this.validateCode = '';
      } else {
        uni.showToast({
          title: msg,
          icon: 'none',
        });
      }
    },
    async beforeClose(action) {},
    async getCode() {
      let { code, msg } = await get('p/send/sms/code', {
        mobile: this.form.phone,
      });
      if (code === 0) {
        this.countDown();
      } else {
        uni.showToast({
          title: msg,
          icon: 'none',
        });
      }
    },
    async submit() {
      const { code, data } = await post(`agent/add/sub-agent`, this.form);
      if (code === 0) {
        uni.showToast({
          title: '创建成功',
        });
        uni.navigateBack();
      }
    },
    getMsg() {
      if (!this.form.phone) return;
      if (!checkPhone(this.form.phone)) {
        return uni.showToast({
          title: '手机格式不对',
          icon: 'none',
        });
      }
      this.changImg();
      this.show = true;
    },
  },
  components: {
    CInput,
  },
};
export default apps;
</script>

<style lang="scss">
.page-login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  .van-cell {
    align-items: center;
  }
  .get {
    font-size: 26rpx;
    &.link {
      color: #1989fa;
    }
  }
  .img {
    width: 140rpx;
    height: 60rpx;
  }
  .dialog-box {
    padding: 0 30rpx;
  }
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
