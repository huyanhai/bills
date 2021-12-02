<template>
  <div class="page-index">
    <Card class="user-op">
      <van-grid column-num="2" :border="false" class="c-tabs">
        <van-grid-item :icon="getAssets('../static/image/scan.png')" text="扫码开票" @click="onScanCode"> </van-grid-item>
        <van-grid-item :icon="getAssets('../static/image/invoice.png')" text="发票抬头" @click="goPath('MyTaiTou')"> </van-grid-item>
      </van-grid>
    </Card>
    <van-cell is-link center @click="goPath('MyCode')">
      <template #icon>
        <img :src="getAssets('../static/image/my_invoice.png')" class="cell-icon" />
      </template>
      <template #title>
        <span class="custom-title">我的发票</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import Card from "../components/Card.vue";
import { get } from "../libs/request";
import { getAssets } from "../libs/utils";
import { getConfig } from "../libs/auth";
import wx from "weixin-js-sdk";

export default {
  data() {
    return {
      skip: false,
      userId: "",
      userInfo: {},
      getAssets: getAssets,
    };
  },
  created() {
    getConfig();
  },
  methods: {
    goNull() {},
    onScanCode() {
      let that = this;
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var url = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          let code = url.split("/") || [];
          let codeId = code[code.length - 1];
          that.checkId(codeId);
        },
      });
    },
    async checkId(codeId) {
      const { code, msg } = await get(`wechat/get/code/${codeId}`, {
        codeId: codeId,
      });
      this.$router.push({
        name: "OpenCard",
        query: {
          codeId: codeId,
        },
      });
    },
    goPath(name) {
      this.$router.push({
        name: name,
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
  padding: 15px;
  background: #eee;
  width: 100%;
  box-sizing: border-box;
  .user-op {
    margin-bottom: 15px;
    display: block;
  }
  .cell-icon {
    width: 15px;
    height: 15px;
    margin-right: 10px;
  }
  .van-cell__title {
    text-align: left;
    line-height: initial;
  }
}
</style>
