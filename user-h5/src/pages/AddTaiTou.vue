<template>
  <div class="add-taitou">
    <div class="more-layer">
      <span class="ll" @click="checkType"></span>
      <van-field v-model="from.typename" label="抬头类型" placeholder="选择抬头类型" :disabled="true" :required="true">
        <template #right-icon>
          <van-icon name="arrow-down" />
        </template>
      </van-field>
    </div>
    <van-field v-model="from.title" label="名称" placeholder="名称" :required="true" v-if="from.type === 2">
      <template #right-icon>
        <img :src="getAssets('../static/image/wechart.png')" v-if="!id" @click="shopMore" class="more-info" />
      </template>
    </van-field>
    <template v-if="from.type === 1">
      <div class="more-layer more-layer1">
        <van-field v-model="from.title" label="企业名称" placeholder="企业名称" :required="true" @input="inputVal">
          <template #right-icon>
            <img :src="getAssets('../static/image/wechart.png')" v-if="!id" @click="shopMore" class="more-info" />
          </template>
        </van-field>
        <div class="layer" v-if="showLayer">
          <div class="lay-item" v-for="item in list" :key="item.taxNo" @click="setItem(item)">
            {{ item.title }}
          </div>
        </div>
      </div>
      <van-field v-model="from.taxNo" label="企业税号" placeholder="企业税号" :required="true" />
      <van-field v-model="from.address" label="企业办公地址" placeholder="企业办公地址" />
      <van-field v-model="from.phone" label="企业电话" placeholder="企业电话" />
      <van-field v-model="from.bank" label="企业开户行" placeholder="企业开户行" />
      <van-field v-model="from.account" label="企业银行账号" placeholder="企业银行账号" />
    </template>
    <van-button class="m-button" type="primary" @click="onSubmit"> 提 交 </van-button>
    <van-popup :show="show" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="[
          { id: 1, name: '企业' },
          { id: 2, name: '个人' },
        ]"
        @confirm="confirmItem"
        @cancel="show = false"
        show-toolbar
        value-key="name"
      />
    </van-popup>
  </div>
</template>

<script>
import CInput from "../components/CInput.vue";
import { post, get } from "../libs/request";
import { getAssets } from "../libs/utils";
import wx from "weixin-js-sdk";
import { Toast } from "vant";
export default {
  data() {
    return {
      getAssets: getAssets,
      id: null,
      show: false,
      showLayer: false,
      list: [],
      from: {
        title: "",
        taxNo: "",
        address: "",
        phone: "",
        bank: "",
        account: "",
        type: 1,
        typename: "企业",
      },
    };
  },
  created() {
    const { id } = this.$route.query;
    if (id) {
      this.id = id;
      this.getList(id);
    }
  },
  components: {
    CInput,
  },
  methods: {
    shopMore() {
      const vm = this;
      wx.chooseInvoiceTitle({
        success(res) {
          console.log(res);
          vm.from.type = res.type === "0" ? 1 : 2;
          vm.from.typename = res.type === "0" ? "企业" : "个人";
          vm.from.title = res.title;
          vm.from.taxNo = res.taxNumber;
          vm.from.address = res.companyAddress;
          vm.from.phone = res.telephone;
          vm.from.bank = res.bankName;
          vm.from.account = res.bankAccount.replace(" ", "");
        },
      });
    },
    checkType() {
      if (this.id) return;
      this.show = true;
    },
    inputVal(e) {
      if (!e.data) {
        this.showLayer = false;
        return;
      }
      this.getData(e.data);
    },
    async getData(newVal) {
      if (!newVal) return;
      const { data } = await get(`wechat/get/zyh/companyCloudTitle?companyTitle=${newVal}`);
      if (data && data.length > 0) {
        this.showLayer = true;
        this.list = data;
      }
    },
    async onSubmit() {
      const vm = this;
      let form = {
        title: this.from.title,
        type: this.from.type,
      };
      if (this.from.type === 1) {
        form = Object.assign({}, this.from);
      }
      if (!this.from.title) {
        return Toast("请输入名称");
      }
      if (this.from.type === 1 && !this.from.taxNo) {
        return Toast("请输入税号");
      }
      if (this.id) {
        form.id = this.id;
      }
      const { code, data } = await post(`wechat/user_history_company/add`, form);
      if (code === 0) {
        Dialog.confirm({
          message: this.id ? "修改成功" : "新增成功",
        })
          .then(() => {
            vm.$router.go(-1);
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    setItem(item) {
      this.from = Object.assign(this.from, item);
      this.showLayer = false;
    },
    confirmItem(e) {
      this.show = false;
      this.from.type = e.id;
      this.from.typename = e.name;
      this.from.title = "";
      this.from.taxNo = "";
      this.from.address = "";
      this.from.phone = "";
      this.from.bank = "";
      this.from.account = "";
    },
    async getList(id) {
      const { code, data } = await get(`wechat/user_history_company/${id}`);
      if (code === 0) {
        this.from = data;
        this.from.typename = data.type === 1 ? "企业" : "个人";
      }
    },
  },
};
</script>

<style lang="scss">
.add-taitou {
  padding: 15px;
  .m-button {
    margin-top: 15px;
    display: block;
    width: 100%;
    button {
      width: 100%;
    }
  }
  .more-info {
    width: 25px;
    height: 25px;
    vertical-align: middle;
  }
  .van-field--disabled .van-field__label {
    color: #646566;
  }
  .van-field__control:disabled {
    -webkit-text-fill-color: #323233;
  }
  .more-layer {
    position: relative;
    z-index: 99;
    .ll {
      width: 100%;
      position: absolute;
      z-index: 10;
      display: block;
      height: 100%;
    }
    .ui-input {
      z-index: 10;
    }
    .layer {
      position: absolute;
      background: #dedede;
      z-index: 100;
      padding: 15px;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      max-height: 500px;
      overflow-y: scroll;
      .lay-item {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        margin-bottom: 10px;
      }
    }
  }
  .more-layer1 {
    z-index: 100;
  }
}
</style>
