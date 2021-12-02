<template>
  <view class="invoice-info">
    <img :src="infoData.pdfImgUrl" class="pdf" v-if="!infoData.pdfImgUrl && infoData.state > 1" @click="previewImage(infoData.pdfImgUrl)" />
    <view class="tips" v-else>
      <text v-if="infoData.state === 0">商户未确认</text>
      <text v-if="infoData.state === 1">开票中，请稍后</text>
    </view>
    <van-button type="info" @click="goPath(`CodeDetails`)" class="btn">查看明细</van-button>
    <van-button type="info" v-if="[2, 4].includes(infoData.state)" @click="show1 = true" class="btn">发票下载</van-button>
    <van-button type="info" @click="show = true" class="btn" v-if="[2, 4].includes(infoData.state)">发送至邮箱</van-button>
    <!-- <van-button type="danger" @click="goRed(`InvoiceInfoNew`)" class="btn">红冲发票</van-button> -->
    <van-dialog
      use-slot
      :show="show"
      show-cancel-button
      @confirm="sendEmail"
      :before-close="beforeClose"
      @cancel="
        show = false;
        email = '';
      "
      title="发送到邮箱"
    >
      <view style="margin: 10px">
        <CInput :value.sync="email" placeholder="请输入邮箱" label="邮箱" :required="true" />
      </view>
    </van-dialog>
    <van-dialog use-slot :show="show1" confirmButtonText="复制" show-cancel-button @confirm="confirmDown" :before-close="beforeClose" @cancel="show1 = false">
      <view style="margin: 10px 0">
        <view class="down">
          <text>下载地址</text>
          <view class="url">{{ infoData.pdfUrl }}</view>
          <text class="tips">请复制下载地址到浏览器中打开下载票据</text>
        </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
import { get, post } from "../../libs/request";
import CInput from "../components/CInput.vue";

export default {
  data() {
    return {
      show: false,
      show1: false,
      id: "",
      infoData: {},
      email: "",
    };
  },
  components: {
    CInput,
  },
  onLoad(e) {
    const { id } = e;
    if (id) {
      this.id = id;
      this.getInvoice();
    }
  },
  methods: {
    beforeClose() {},
    async sendEmail() {
      if (!this.email) return;
      const { code } = await get("user/repeat/email", {
        invioiceId: this.id,
        email: this.email,
      });
      if (code === 0) {
        this.show = false;
        this.email = "";
        uni.showToast({
          icon: "none",
          title: "发送成功",
        });
      }
    },
    goRed(path) {
      this.$router.push({
        name: path,
        query: {
          id: this.id,
        },
      });
    },
    goPath(path) {
      uni.navigateTo({
        url: `${path}?id=${this.id}`,
      });
    },
    confirmDown() {
      let url = `https://pmy.funku.cn/agent/api/p/download/pdf/${this.id}`;
      const vm = this;
      console.log(url);
      uni.setClipboardData({
        data: url,
        success() {
          vm.show1 = false;
          uni.showToast({
            icon: "none",
            title: "复制成功",
          });
        },
      });
    },
    async getInvoice() {
      const { data, code } = await get("user/get/invoice_info", {
        id: this.id,
      });
      if (code === 0) {
        this.infoData = data;
      }
    },
    previewImage(url) {
      uni.previewImage({
        current: url,
        urls: [url],
      });
    },
  },
};
</script>

<style lang="scss">
.van-dialog__header {
  padding-top: 20rpx !important;
}
.invoice-info {
  padding: 30rpx;
  .pdf {
    width: 100%;
    margin-bottom: 60rpx;
  }
  .btn {
    margin-bottom: 20rpx;
    display: block;
    button {
      width: 100%;
    }
  }
  .tips {
    margin: 100rpx 0;
    text-align: center;
    text {
      font-size: 28rpx;
      color: gray;
    }
  }
}
.down {
  text-align: left;
  padding: 30rpx;
  .url {
    font-size: 28rpx;
    color: #1989fa;
    margin-top: 20rpx;
    word-break: break-all;
  }
  .tips {
    font-size: 24rpx;
    color: rgba($color: #000000, $alpha: 0.2);
  }
}
</style>
