<template>
  <view class="page-index">
    <view class="card">
      <view class="title">{{ shopInfo.siteName }}</view>
      <view class="jifen" v-if="shopInfo.expireTime">到期时间:{{ (shopInfo.expireTime || "").split(" ")[0] }}</view>
      <view class="m-op">
        <view class="col-l">
          <view class="name">普通电票</view>
          <view class="num">{{ blankInvoice.valueAddedElectroniceInvoice || 0 }}</view>
        </view>
        <view class="col-l">
          <view class="name">专用电票</view>
          <view class="num">{{ blankInvoice.vatSpecialElectroniceInvoice || 0 }}</view>
        </view>
        <view class="col-l">
          <view class="name">普通纸票</view>
          <view class="num">{{ blankInvoice.vatSpecialInvoice || 0 }}</view>
        </view>
        <view class="col-l">
          <view class="name">专用纸票</view>
          <view class="num">{{ blankInvoice.valueAddedTaxInvoice || 0 }}</view>
        </view>
      </view>
    </view>
    <Card>
      <van-grid direction="vertical" column-num="3" class="c-tabs" :border="false">
        <van-grid-item>
          <template #icon>
            <text class="text">今日开票</text>
          </template>
          <template #text>{{ statistical.todayGetInvoice || 0 }}</template>
        </van-grid-item>
        <van-grid-item>
          <template #icon>
            <text class="text">昨日开票</text>
          </template>
          <template #text>{{ statistical.yesterdayGetInvoice || 0 }}</template>
        </van-grid-item>
        <van-grid-item>
          <template #icon>
            <text class="text">本月开票</text>
          </template>
          <template #text>{{ statistical.monthGetInvoice || 0 }}</template>
        </van-grid-item>
      </van-grid>
    </Card>
    <Card>
      <!-- <view class="kaip-items">
        <view class="col-l">月开票:￥{{ statisticalp.money }}</view>
        <view class="col-r">月冲红:￥{{ statisticalp.redMoney }}</view>
      </view> -->
      <van-grid direction="vertical" column-num="3" class="m-grid" :border="false">
        <van-grid-item :icon="require('../static/image/kp.png')" text="待开票" @click="goPage('0')" :badge="waitingNum" />
        <van-grid-item :icon="require('../static/image/kp.png')" text="已开票" @click="goPage('1')" />
        <van-grid-item :icon="require('../static/image/kp.png')" text="冲红发票" @click="goPage('2')" />
      </van-grid>
    </Card>
  </view>
</template>

<script>
import Card from "../components/Card.vue";
import { get } from "../../libs/request";

export default {
  data() {
    return {
      title: "Hello",
      isOpen: false,
      shopInfo: {},
      waitingNum: 0,
      blankInvoice: {},
      timer: null,
      statistical: {},
      statisticalp: {},
    };
  },
  onShow() {
    let authCode = uni.getStorageSync("authCode");
    if (!authCode) {
      uni.showToast({
        title: "登录超时，请重新登录",
        icon: "none",
        duration: 2000,
      });
      return uni.reLaunch({
        url: "/pages/Login",
      });
    }
    this.getShopInfo();
    this.getBlank();
    this.getWaiting();
    this.getStatistical();
    this.getStatisticalPage();
    this.timer = setInterval(() => {
      this.getWaiting();
    }, 20000);
  },
  onHide() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  onTabItemTap(item) {
    if (item.index === 1) {
      return uni.showToast({
        title: "暂未开放",
      });
    }
  },
  methods: {
    titleClick() {
      console.log("titleClick");
    },
    async getStatisticalPage() {
      const { data } = await get("site/site_info/monthly/invoice/statistical/page");
      this.statisticalp = data;
    },
    async getStatistical() {
      const { data } = await get("site/login/statistical");
      this.statistical = data;
    },
    async getWaiting() {
      const { data } = await get("site/query/waiting_invoice");
      if (data > 0) {
        this.waitingNum = data;
      } else {
        this.waitingNum = 0;
      }
    },
    async getBlank() {
      const { data } = await get("site/query/blank_invoice");
      if (data) {
        this.blankInvoice = data;
        if (data?.valueAddedElectroniceInvoice < 10) {
          uni.showModal({
            content: "发票数量不足，请及时领取",
          });
        }
      }
    },
    async getShopInfo() {
      const { data } = await get("site/login/site/info");
      if (data) {
        this.shopInfo = data;
        // const time = new Date(data.expireTime).getTime();
        // const today = new Date().getTime();
        // if (today > time) {
        //   this.showModel();
        // }
        if (!data.expireTime) {
          this.showModel();
        }
      }
    },
    showModel() {
      uni.showModal({
        title: "你的账号未激活",
        content: "你的账号未激活，将不能开票",
        // cancelText: "取消",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            // uni.navigateTo({
            //   url: "Open",
            // });
          } else if (res.cancel) {
          }
        },
      });
    },
    goPage(e) {
      uni.navigateTo({
        url: `Billing?type=${e}`,
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
  .kaip-items {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    border-bottom: 1px solid rgba($color: #000, $alpha: 0.1);
    padding-bottom: 20rpx;
    color: rgb(94, 94, 94);
  }
  .card {
    width: 100%;
    background: black;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 30rpx 0;
    .title {
      font-size: 38rpx;
      font-weight: bold;
      color: rgb(251, 255, 0);
    }
    .jifen {
      font-size: 22rpx;
      color: #fff;
      margin: 30rpx 40rpx;
    }
    .m-op {
      display: flex;
      text-align: center;
      width: 100%;
      font-size: 26rpx;
      color: #fff;
      .col-l {
        width: 50%;
      }
    }
    .can {
      padding: 0 30rpx;
      box-sizing: border-box;
      width: 100%;
      margin: 30rpx 0;
      .tips {
        font-size: 24rpx;
        color: rgba($color: #fff, $alpha: 0.7);
      }
      .can-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30rpx;
        .item {
          width: calc(100% / 3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: #fff;
          .name {
            font-size: 30rpx;
          }
          .num {
            font-size: 28rpx;
            color: rgb(251, 255, 0);
            margin-top: 10rpx;
          }
        }
      }
    }
  }
  .m-card {
    margin-top: 30rpx;
    .m-grid {
      width: 100%;
      margin-top: 30rpx;
    }
    .c-tabs {
      display: block;
      border-radius: 10rpx;
      overflow: hidden;
      .text {
        font-size: 28rpx;
        font-weight: bold;
      }
    }
  }
}
</style>
