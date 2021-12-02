<template>
  <view class="page-open">
    <van-radio-group @change="onRadioChange" :value="value">
      <van-radio :name="item.id" v-for="item in list" :key="item.taxNo">
        <view class="box">
          <view class="ui-title">{{ item.remark }}</view>
        </view>
      </van-radio>
    </van-radio-group>
    <!-- <van-button class="m-button" type="info" @getuserinfo="onGetAuthorize('user')" open-type="getUserInfo" v-if="!isAuth">
      确定
    </van-button> -->
    <van-button class="m-button" type="info" @click="onSubmit">
      确定
    </van-button>
  </view>
</template>

<script>
import { get } from "../../libs/request";
import { userLogin } from "../../libs/auth";

export default {
  data() {
    return {
      value: "",
      list: [],
      isAuth: false,
      orderNum: "",
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    async getData() {
      const { data } = await get("site/get/sys_invoice_menu");
      if (data) {
        this.list = data;
        this.value = data[0].id;
      }
    },
    onRadioChange(e) {
      this.value = e.detail;
    },
    async onSubmit() {
      if (!this.value) return;
      const _this = this;
      const { data, code } = await get("site/wxpay/prepay", {
        invoiceMenuId: this.value,
      });
      if (code === 0) {
        this.orderNum = data.orderNum;
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success() {
            _this.getStatus();
          },
          fail(res) {
            uni.showToast({
              title: "支付失败",
              duration: 2000,
              icon: "none",
            });
          },
        });
      }
    },
    async getStatus() {
      const { code } = await get("site/wxpay/status", {
        orderNum: this.orderNum,
      });
      if (code === 0) {
        uni.showModal({
          title: "",
          content: "支付成功,请等待审核",
          confirmText: "好的",
          success: function (res) {
            if (res.confirm) {
              uni.switchTab({
                url: "Index",
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.page-open {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 30rpx;
  .box {
    display: flex;
    flex-direction: column;
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
  .dialog-box {
    box-sizing: border-box;
    padding: 30rpx;
  }
  .m-button {
    margin-top: 60rpx;
    display: block;
    button {
      width: 100%;
    }
  }
}
</style>
