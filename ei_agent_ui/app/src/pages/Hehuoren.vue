<template>
  <view class="page-hehuoren">
    <view class="logo">
      <image src="../static/image/logo.png" mode="aspectFit" />
    </view>
    <van-button type="info" class="ui-btn" @click="goPage('BindHehuoren')">
      成为合伙人
    </van-button>
    <van-button type="info" class="ui-btn" @click="show = true">
      成为区域合伙人
    </van-button>
    <van-button type="info" class="ui-btn" @click="show = true">
      成为城市合伙人
    </van-button>
    <text class="bottom-name">重庆票盟科技有限公司</text>
    <van-dialog
      use-slot
      :show="show"
      show-cancel-button
      :overlay="true"
      @cancel="show = false"
      @confirm="confirm"
      confirmButtonText="拨打电话"
    >
      <view class="dialog-box">
        <image :src="joininfo.url"></image>
        <view class="item"> {{ joininfo.name }}:{{ joininfo.phone }} </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
import { post, get } from '../../libs/request';
import CityPicker from '../components/CityPicker.vue';
import CInput from '../components/CInput.vue';

export default {
  data() {
    return {
      show: false,
      joininfo: {},
      pickerInfo: {},
      phone: '',
    };
  },
  components: {
    CityPicker,
    CInput,
  },
  onLoad(e) {
    this.phone = e.phone;
    this.getJoininfo();
  },
  methods: {
    goPage(path) {
      uni.navigateTo({
        url: `${path}?phone=${this.phone}`,
      });
    },
    confirm() {
      const vm = this;
      this.show = false;
      uni.makePhoneCall({
        phoneNumber: vm.joininfo.phone,
      });
    },
    async getJoininfo() {
      const { code, data } = await get('p/joininfo');
      if (code === 0) {
        this.joininfo = data;
      }
    },
  },
};
</script>

<style lang="scss">
.page-hehuoren {
  min-height: 100vh;
  background: #eee;

  .container {
    padding: 30rpx;
    .ui-btn {
      padding: 0;
    }
  }
  .van-popup {
    border-radius: 20rpx;
    width: 80%;
  }
  .logo {
    padding-top: 30rpx;
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

  .bottom-name {
    position: absolute;
    bottom: 60rpx;
    text-align: center;
    width: 100%;
    font-size: 24rpx;
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
.dialog-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 30rpx 0;
  image {
    width: 400rpx;
    height: 400rpx;
    margin-bottom: 30rpx;
  }
  .item {
    font-size: 36rpx;
  }
}
</style>
