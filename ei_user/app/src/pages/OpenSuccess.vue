<template>
  <view class="page-success">
    <van-icon name="checked" />
    <view class="title">开票抬头提交成功</view>
    <view class="tips">请等待商户确认开具发票</view>
    <van-button class="m-button" type="info" @click="openAd">
      领取开票福利
    </van-button>
    <van-button class="m-button" type="info" @click="queren">
      完成
    </van-button>
  </view>
</template>

<script>
export default {
  onLoad() {
    this.addAd();
  },
  methods: {
    addAd() {
      // 在页面中定义插屏广告
      let interstitialAd = null;

      // 在页面onLoad回调事件中创建插屏广告实例
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: "adunit-a91fbcf226739279",
        });
        interstitialAd.onLoad(() => {});
        interstitialAd.onError((err) => {});
        interstitialAd.onClose(() => {});
      }

      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err);
        });
      }
    },
    audioAd() {
      // 在页面中定义激励视频广告
      let videoAd = null;

      // 在页面onLoad回调事件中创建激励视频广告实例
      if (wx.createRewardedVideoAd) {
        videoAd = wx.createRewardedVideoAd({
          adUnitId: "adunit-d9135cecc27ae75b",
        });
        videoAd.onLoad(() => {});
        videoAd.onError((err) => {});
        videoAd.onClose((res) => {});
      }

      // 用户触发广告后，显示激励视频广告
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd
            .load()
            .then(() => videoAd.show())
            .catch((err) => {
              console.log("激励视频 广告显示失败");
            });
        });
      }
    },
    openAd() {
      this.audioAd();
    },
    queren() {
      uni.navigateTo({
        url: "Index",
      });
    },
  },
};
</script>

<style lang="scss">
.page-success {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 80rpx;
  box-sizing: border-box;
  .van-icon {
    font-size: 200rpx;
    color: green;
    margin-bottom: 40rpx;
  }
  .title {
    font-size: 34rpx;
    color: green;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  .tips {
    font-size: 28rpx;
    margin-bottom: 80rpx;
  }
  .m-button {
    width: 100%;
    margin-bottom: 20rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    display: block;
    button {
      width: 100%;
    }
  }
}
</style>
