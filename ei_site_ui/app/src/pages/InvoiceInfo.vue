<template>
  <view class="invoice-info">
    <image :src="infoData.pdfImgUrl" class="pdf" v-if="infoData.pdfImgUrl" @click="previewImage(infoData.pdfImgUrl)" />
    <view class="tips" v-else>
      <text v-if="infoData.state === 5">已取消</text>
      <text v-if="infoData.state === 0">商户未确认</text>
      <text v-if="infoData.state === 1">开票中，请稍后</text>
      <text v-if="infoData.state === 6">验签中</text>
      <text v-if="infoData.state === 7">红票验签中</text>
    </view>
    <van-button type="info" @click="goPath(`${to}?id=${id}`)" class="btn">查看明细</van-button>
    <van-button type="info" v-if="[2].includes(infoData.state) || [7, 4].includes(infoData.invoiceTypeCode)" @click="show1 = true" class="btn">发票下载</van-button>
    <template v-if="infoData.state === 2">
      <van-button type="primary" @click="show = true" class="btn" v-if="[2].includes(infoData.state) || [7, 4].includes(infoData.invoiceTypeCode)">发送至邮箱</van-button>
      <van-button type="danger" class="btn" @click="confirm">
        冲红
      </van-button>
      <!-- <van-button type="primary" class="btn" @click="show2 = true">
        重新发送
      </van-button> -->
    </template>
    <van-button type="info" v-if="[4].includes(infoData.state)" @click="goPath(`InvoiceInfo1?id=${id}`)" class="btn">查看冲红发票</van-button>
    <van-dialog use-slot :show="show2" show-cancel-button @confirm="dialogConfirm" :overlay="true" @cancel="show2 = false">
      <view class="dialog-box">
        <CInput :value.sync="email" placeholder="请输入邮箱" label="邮箱"> </CInput>
      </view>
    </van-dialog>
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
      show2: false,
      id: "",
      infoData: {},
      email: "",
      to: null,
    };
  },
  components: {
    CInput,
  },
  onLoad(e) {
    const { id, to } = e;
    if (id) {
      this.id = id;
      this.to = to;
      this.getInvoice();
    }
  },
  methods: {
    dialogConfirm() {
      this.show2 = false;
      if (!this.email) {
        return uni.showToast({
          title: "邮箱不能为空",
          icon: "none",
        });
      }
      this.reSend();
    },
    confirm() {
      const vm = this;
      uni.showModal({
        title: "确认冲红",
        content: "发票冲红后会导致客户收到的发票作废，是否继续冲红操作",
        cancelText: "取消",
        confirmText: "继续",
        success: function(res) {
          if (res.confirm) {
            vm.redApi();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    async redApi() {
      const { data } = await get("site/get/invoice/red", {
        invioiceId: this.id,
      });
      if (data) {
        this.reSend(true);
      }
    },
    redSuccess() {
      const vm = this;
      uni.showModal({
        title: "冲红成功",
        content: "当前发票冲红成功",
        showCancel: false,
        confirmText: "确定",
        success: function(res) {
          if (res.confirm) {
            vm.show = false;
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    async reSend(back) {
      const parme = { invioiceId: this.id };
      if (!back) {
        parme.email = this.email;
      }
      const { data } = await get("site/repeat/email", parme);
      if (back) {
        uni.showToast({
          title: "冲红成功",
        });
        return uni.navigateBack({
          delta: 1,
        });
      }
      if (data) {
        uni.showModal({
          title: "重发成功",
          content: "发票已重发给客服邮箱",
          showCancel: false,
          confirmText: "返回",
          success: function(res) {
            if (res.confirm) {
              uni.navigateBack({
                delta: 1,
              });
            }
          },
        });
      }
    },
    async sendEmail() {
      if (!this.email) return;
      const { code } = await get("site/repeat/email", {
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
      const { data, code } = await get("site/get/invoice_info", {
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
.dialog-box {
  box-sizing: border-box;
  padding: 30rpx;
  text-align: left;
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
