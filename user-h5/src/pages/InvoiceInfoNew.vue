<template>
  <div class="invoice-info">
    <img :src="infoData.redPdfImgUrl" class="pdf" v-if="infoData.redPdfImgUrl" />
    <van-button type="primary" @click="goPath(`CodeDetails`)">查看明细</van-button>
    <van-button type="primary" @click="xiazai" v-if="infoData.redPdfImgUrl">发票下载</van-button>
    <van-button type="primary" @click="show = true">发送至邮箱</van-button>
    <van-dialog v-model:show="show" show-cancel-button @confirm="sendEmail" :before-close="beforeClose" @cancel="show = false">
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
        Toast("发送成功");
        this.show = false;
      }
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
      let url = this.infoData.redPdfImgUrl;
      Dialog.confirm({
        title: "票据下载",
        message: `<div class="down"><p>下载地址</p><div class="url">${url}</div></div>`,
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
  button {
    width: 100%;
    margin-bottom: 10px;
  }
}
.down {
  text-align: left;
  .url {
    font-size: 14px;
    color: #1989fa;
  }
}
</style>
