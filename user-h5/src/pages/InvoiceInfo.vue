<template>
  <div class="invoice-info">
    <img :src="infoData.pdfImgUrl" class="pdf" v-if="infoData.pdfImgUrl && infoData.state > 1" />
    <div class="tips" v-else>
      <p v-if="infoData.state === 0">商户未确认</p>
      <p v-if="infoData.state === 1">开票中，请稍后</p>
    </div>
    <van-button type="primary" @click="goPath(`CodeDetails`)" class="btn">查看明细</van-button>
    <van-button type="primary" v-if="infoData.pdfImgUrl && [2, 4].includes(infoData.state)" @click="xiazai" class="btn">发票下载</van-button>
    <van-button type="primary" @click="show = true" class="btn" v-if="[2, 4].includes(infoData.state)">发送至邮箱</van-button>
    <!-- <van-button type="danger" @click="goRed(`InvoiceInfoNew`)" class="btn">红冲发票</van-button> -->
    <van-dialog v-model:show="show" show-cancel-button @confirm="sendEmail" :before-close="beforeClose" @cancel="show = false" title="发送到邮箱">
      <div style="margin: 10px 0">
        <van-field v-model="email" label="邮箱" :required="true" placeholder="邮箱">
          <van-icon name="arrow-down" />
        </van-field>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import { get, post } from "../libs/request";
import { session } from "../libs/storage";
import copy from "clipboard-copy";
export default {
  data() {
    return {
      show: false,
      id: "",
      type: null,
      infoData: {},
      email: "",
    };
  },
  created() {
    const { id, token, type } = this.$route.query;
    if (token) {
      session.set("token", token);
    }
    if (id) {
      this.id = id;
      this.getInvoice();
    }
    if (type) {
      this.type = type;
    }
    document.title = "查看发票";
  },
  methods: {
    beforeClose() {},
    async sendEmail() {
      if (!this.email) return;
      const { code } = await get("user/repeat/email", {
        params: {
          invioiceId: this.id,
          email: this.email,
        },
      });
      if (code === 0) {
        this.show = false;
        Toast("发送成功");
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
      this.$router.push({
        name: path,
        query: {
          id: this.id,
        },
      });
    },
    xiazai() {
      let url = `https://pmy.funku.cn/agent/api/p/download/pdf/${this.id}`;
      Dialog.confirm({
        title: "票据下载",
        message: `<div class="down"><p>下载地址</p><div class="url">${url}</div><p class='tips'>请复制下载地址到浏览器中打开下载票据</p></div>`,
        allowHtml: true,
        confirmButtonText: "复制",
      }).then(() => {
        copy(url);
        Toast("复制成功");
      });
    },
    async getInvoice() {
      const { data, code } = await get("user/get/invoice_info", {
        params: {
          id: this.id,
        },
      });
      if (code === 0) {
        this.infoData = data;
      }
    },
  },
};
</script>

<style lang="scss">
.invoice-info {
  padding: 15px;
  .pdf {
    width: 100%;
    margin-bottom: 30px;
  }
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
  .tips {
    margin: 50px 0;
    p {
      font-size: 14px;
      color: gray;
    }
  }
}
.down {
  text-align: left;
  .url {
    font-size: 14px;
    color: #1989fa;
  }
  .tips {
    font-size: 12px;
    color: rgba($color: #000000, $alpha: 0.2);
  }
}
</style>
