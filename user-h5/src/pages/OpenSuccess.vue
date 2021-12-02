<template>
  <div class="page-success">
    <van-icon name="checked" />
    <div class="title">开票抬头提交成功</div>
    <div class="tips">请等待商户确认开具发票</div>
    <!-- <van-button class="m-button" type="primary" @click="openAd"> 领取开票福利 </van-button> -->
    <van-button class="m-button" type="primary" @click="queren"> 完成 </van-button>
  </div>
</template>

<script>
export default {
  onLoad() {},
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
      this.$router.push({
        path: "/",
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
  padding: 40px 15px 0 15px;
  box-sizing: border-box;
  .van-icon {
    font-size: 100px;
    color: green;
    margin-bottom: 20px;
  }
  .title {
    font-size: 17px;
    color: green;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .tips {
    font-size: 14px;
    margin-bottom: 40px;
  }
  .m-button {
    margin: 0 15px 10px 15px;
    box-sizing: border-box;
    display: block;
    width: 100%;
  }
}
</style>
