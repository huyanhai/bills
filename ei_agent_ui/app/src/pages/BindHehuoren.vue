<template>
  <view class="page-hehuoren">
    <template v-if="step === 1">
      <view class="red-tips">第一步：选择业务地区</view>
      <CityPicker
        placeholder="请输入地址"
        label="地址"
        @pickerInfo="pickerInfo"
        customClass="page-hehuoren"
      />
      <CInput
        :value.sync="address"
        placeholder="请输入详细地址"
        label="详细地址"
        :required="true"
      />
      <van-button type="info" class="ui-btn" @click="region">
        确定
      </van-button>
      <view class="tips">请准备填写，业务发展不限制地区</view>
    </template>
    <template v-if="step === 2">
      <view class="red-tips">第二步：支付技术服务费</view>
      <view class="item">
        地区：{{ provinceData[0].name || '' }} - {{ provinceData[1].name || '' }}-
        {{ provinceData[2].name || '' }}
      </view>
      <view class="item">技术服务费：3800 元</view>
      <van-button type="info" class="ui-btn" @click="getPayData">
        支付
      </van-button>
      <van-button type="info" class="ui-btn" @click="goBack">
        取消
      </van-button>
    </template>
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
      step: 1,
      provinceData: [],
      phone: '',
      address: '',
    };
  },
  components: {
    CityPicker,
    CInput,
  },
  onLoad(e) {
    this.phone = e.phone;
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    pickerInfo(e) {
      this.provinceData = e;
    },
    async region() {
      if (this.provinceData.length < 1) return;
      const [one, two, three] = this.provinceData;
      const { code } = await post('p/update/region', {
        address: this.address,
        phone: this.phone,
        provinceId: parseInt(one?.id),
        cityId: parseInt(two?.id),
        countyId: parseInt(three?.id),
      });
      if (code === 0) {
        this.step = 2;
      }
    },
    async getPayData() {
      const { code, data } = await get('p/upgrade/wxpay/prepay', {
        phone: this.phone,
      });
      if (code === 0) {
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success() {
            _this.getStatus(data.orderNum);
          },
          fail(res) {
            uni.showToast({
              title: '支付失败',
              duration: 2000,
              icon: 'none',
            });
          },
        });
      }
    },
    async getStatus(orderNum) {
      if (!orderNum) return;
      const { code } = await get('agent/wxpay/status', {
        orderNum: orderNum,
      });
      if (code === 0) {
        uni.showToast({
          title: '开通成功,请重新登录',
          duration: 2000,
          icon: 'none',
        });
        uni.redirectTo({
          url: 'Login',
        });
      }
    },
  },
};
</script>

<style lang="scss">
.page-hehuoren {
  min-height: 100vh;
  background: #fff;
  padding: 0 30rpx;
  .van-field__label--disabled {
    color: #646566 !important;
  }
  .van-field__control--disabled {
    color: #323233;
  }
  .red-tips {
    text-align: center;
    width: 100%;
    font-size: 40rpx;
    margin: 30rpx 0;
    color: red;
  }
  .item {
    font-size: 38rpx;
    margin-top: 30rpx;
    color: #646566;
    border-bottom: 2rpx solid #eee;
    padding: 30rpx 0;
  }
  .tips {
    text-align: center;
    width: 100%;
    font-size: 28rpx;
    margin-top: 30rpx;
    color: #646566;
  }
  .ui-btn {
    width: 100%;
    display: block;
    box-sizing: border-box;
    margin-top: 60rpx;
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
