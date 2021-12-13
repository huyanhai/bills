<template>
  <div class="page-box">
    <div class="page-open" v-if="showPage">
      <div class="box1">
        <div class="llayer" @click="hideLayer" v-if="showLayer"></div>
        <Card class="m-card">
          <div class="box">
            <div class="ui-title">{{ shopInfo.siteTitle }}</div>
            <div class="ui-text">为你开票</div>
          </div>
        </Card>
        <div class="more-layer">
          <span class="ll" @click="showItem(1)"></span>
          <van-field v-model="updateType.name" label="开票类型" :disabled="true" :required="true" placeholder="选择开票类型" right-icon="arrow-down" />
        </div>
        <template v-if="updateType.value === 1">
          <div class="more-layer" v-if="shopInfo.specialInvoice !== 2">
            <span class="ll" @click="showItem(2)"></span>
            <van-field v-model="qiye.invoiceTypeName" label="发票类型" :disabled="true" :required="true" placeholder="选择发票类型" right-icon="arrow-down" />
          </div>
          <div class="more-layer more-layer1">
            <van-field v-model="qiye.title" label="发票抬头" :required="true" placeholder="发票抬头" @input="inputVal">
              <template #right-icon>
                <img :src="getAssets('../static/image/fp.png')" @click="getList" class="more-info-img" />
              </template>
            </van-field>
            <div class="layer" v-if="showLayer">
              <div class="lay-item" v-for="item in list" :key="item.taxNo" @click="setItem(item)">
                {{ item.title }}
              </div>
            </div>
          </div>
          <van-field v-model="qiye.taxNo" label="企业税号" :required="true" placeholder="企业税号" />
        </template>
        <template v-if="updateType.value === 2">
          <van-field v-model="geren.title" label="姓名" :required="true" placeholder="姓名" />
        </template>
        <div class="more-layer">
          <van-field v-model="receiveEmail" label="邮箱地址" :required="true" placeholder="邮箱地址" @blur="emailBlur" @focus="emailFocus()" />
          <div class="layer" v-if="emailList.length > 0 && showEmailLayer">
            <div class="lay-item" v-for="item in emailList" :key="item" @click="setEmail(item)">
              {{ item }}
            </div>
          </div>
        </div>
        <van-field v-model="money" label="消费金额" type="number" :required="true" placeholder="消费金额" />
        <template v-if="updateType.value === 1">
          <van-field v-model="qiye.bank" label="开户银行" placeholder="开户银行" />
          <van-field v-model="qiye.account" label="银行账号" placeholder="银行账号" />
          <van-field v-model="qiye.address" label="地址" placeholder="地址" />
        </template>
        <van-field v-model="receivePhone" label="手机号码" placeholder="手机号码" />
        <van-field v-model="remarks" label="备注" placeholder="备注" />
        <van-button class="m-button" type="primary" @click="onSubmit">提 交</van-button>
      </div>
      <div class="m-foot">重庆票盟科技有限公司</div>
      <van-popup :show="show" position="bottom" :close-on-click-overlay="false">
        <van-picker
          :columns="[
            { id: 1, name: '企业' },
            { id: 2, name: '个人' },
          ]"
          @confirm="confirmItem"
          @cancel="cancel"
          show-toolbar
          value-key="name"
          v-if="item === 1"
        />
        <van-picker
          :columns="[
            { id: 2, name: '普票' },
            { id: 1, name: '专票' },
          ]"
          @cancel="cancel"
          @confirm="confirmItem"
          show-toolbar
          value-key="name"
          v-if="item === 2"
        />
      </van-popup>
      <van-popup :show="show1" position="bottom" :close-on-click-overlay="false">
        <van-picker :columns="companyList" @confirm="confirmItem1" @cancel="show1 = false" show-toolbar value-key="title" />
      </van-popup>
    </div>
    <div v-else class="null-box">
      <van-empty :image="getAssets('../static/image/logo.png')" />
      <div class="jzz">努力加载中...</div>
      <div class="copyright">重庆票盟科技有限公司</div>
    </div>
  </div>
</template>

<script>
import CInput from "../components/CInput.vue";
import { post, get } from "../libs/request";
import Card from "../components/Card.vue";
import { checkPhone, checkEmail } from "../libs/utils";
import { getAssets } from "../libs/utils";
import { Toast } from "vant";
import { session } from "../libs/storage";
import { Dialog } from "vant";
export default {
  data() {
    return {
      updateType: {
        name: "企业",
        value: 1,
      },
      show: false,
      item: null,
      qiye: {
        invoiceType: 2,
        invoiceTypeName: "普票",
        title: "",
        taxNo: "",
        bank: "",
        account: "",
      },
      geren: {
        title: "",
      },
      codeId: null,
      receiveEmail: "",
      receivePhone: "",
      shopInfo: {},
      list: [],
      showLayer: false,
      showPage: false,
      msg: "欢迎使用票盟云电子发票平台",
      showEmailLayer: false,
      remarks: "",
      money: "",
      getAssets: getAssets,
      orderNumber: null,
      qrCode: null,
      companyList: [],
      show1: false,
    };
  },
  components: {
    CInput,
    Card,
  },
  computed: {
    emailList() {
      if (!this.receiveEmail) return [];
      if (this.receiveEmail.includes("@")) return [];
      return ["@qq.com", "@163.net", "@gmail.com", "@yahoo.com", "@msn.com", "@hotmail.com", "@aol.com", "@ask.com", "@live.com", "@0355.net", "@163.com", "@263.net", "@3721.net", "@yeah"].map(
        (item) => {
          return `${this.receiveEmail}${item}`;
        }
      );
    },
  },
  created() {
    let { token, orderNumber } = this.$route.query;
    let { id } = this.$route.params;
    if (token) {
      session.set("token", token);
    }
    if (orderNumber) {
      this.orderNumber = orderNumber;
    }
    if (id) {
      this.$nextTick(async () => {
        this.qrCode = id;
        await this.checkId();
        this.getShopInfo();
        this.getCompany();
      });
    }
  },
  methods: {
    confirmItem1(e) {
      if (this.updateType.value === 1) {
        this.qiye = Object.assign(this.qiye, e);
      } else {
        this.geren.title = e.detail.value.title;
      }
      this.show1 = false;
    },
    async getList() {
      const { code, data } = await post(`wechat/user_history_company/page`, {
        page: 1,
        limit: 100,
        searchModel: {
          type: this.updateType.value,
        },
      });
      if (code === 0) {
        this.companyList = data;
        this.show1 = true;
      }
    },
    async getCompany() {
      const vm = this;
      const { code, data } = await get(`wechat/get/latest/company`);
      if (code === 0 && data) {
        Dialog.confirm({
          title: "上次开票抬头",
          message: `${data.title}${data.taxNo}`,
          confirmButtonText: "继续开票",
          cancelButtonText: "取消开票",
        })
          .then(() => {
            vm.qiye.title = data.title;
            vm.qiye.taxNo = data.taxNo;
            vm.qiye.address = data.address;
            vm.receivePhone = data.phone;
            vm.qiye.bank = data.bank;
            vm.qiye.account = data.account;
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    cancel() {
      this.show = false;
      this.item = null;
    },
    checkAuth() {
      return get("p/validation/token");
    },
    emailFocus() {
      this.showEmailLayer = true;
    },
    emailBlur() {
      const vm = this;
      setTimeout(() => {
        vm.showEmailLayer = false;
      }, 100);
    },
    setEmail(item) {
      this.receiveEmail = item;
    },
    async checkId() {
      const { code, msg } = await get(`wechat/get/code/${this.qrCode}`);
      if (code === 0) {
        this.showPage = true;
      } else {
        this.msg = msg;
      }
    },
    hideLayer() {
      this.showLayer = false;
    },
    inputVal(e) {
      if (!this.qiye.title) {
        this.showLayer = false;
        return;
      }
      this.getData(this.qiye.title);
    },
    showItem(type) {
      if (this.shopInfo.specialInvoice === 2 && type === 2) return;
      this.item = type;
      this.show = true;
    },
    setItem(item) {
      this.qiye = Object.assign(this.qiye, item);
      this.showLayer = false;
    },
    confirmItem(e) {
      switch (this.item) {
        case 1:
          this.updateType.value = e.id;
          this.updateType.name = e.name;
          break;
        case 2:
          this.qiye.invoiceType = e.id;
          this.qiye.invoiceTypeName = e.name;
          break;
        default:
          break;
      }
      this.show = false;
      this.item = null;
    },
    searchTitle() {
      if (!this.qiye.title) {
        return Toast({
          title: "请输入内容",
          duration: 2000,
          icon: "none",
        });
      }
      this.$router.push({
        path: `search-title?companyCloudTitle=${this.qiye.title}`,
      });
    },
    async getData(newVal) {
      if (!newVal) return;
      const { data } = await get(
        `wechat/get/zyh/companyCloudTitle`,
        {
          params: {
            companyTitle: newVal,
          },
        },
        false
      );
      if (data && data.length > 0) {
        this.showLayer = true;
        this.list = data;
      }
    },
    async getShopInfo() {
      const { data, code } = await get(`wechat/get/site/${this.qrCode}`, {});
      if (code === 0) {
        this.shopInfo = data;
        if (data.specialInvoice === 2) {
          this.qiye.invoiceType = 2;
          this.qiye.invoiceTypeName = "普票";
        }
      }
    },
    async onSubmit() {
      if (!this.receiveEmail || !checkEmail(this.receiveEmail)) {
        return Toast("请检查邮箱");
      }
      if (!this.money) {
        return Toast("请输入金额");
      }
      let from = {};
      if (this.updateType.value === 1) {
        if (!this.qiye.title) {
          return Toast("请输入发票抬头");
        } else {
          from = Object.assign({}, this.qiye);
        }
      }
      if (this.updateType.value === 2) {
        from = Object.assign({}, this.geren, {
          invoiceType: 2,
        });
      }
      if (!from.taxNo && this.updateType.value === 1) {
        return Toast("企业税号不能为空");
      }
      if (from.taxNo && this.updateType.value === 1) {
        if (from.taxNo.length < 14 || from.taxNo.length > 25) {
          return Toast("企业税号长度在14-25");
        }
      }
      from = Object.assign(from, {
        codeId: this.qrCode,
        receiveEmail: this.receiveEmail,
        receivePhone: this.receivePhone,
        remarks: this.remarks,
        buyType: this.updateType.value,
        money: this.money,
      });
      if (this.orderNumber) {
        from.orderNumber = this.orderNumber;
      }
      const { code } = await post("wechat/put/invoice", from);
      if (code === 0) {
        Dialog.alert({
          title: "提交成功",
          message: "抬头提交成功，请通知商家开票",
          showCancelButton: false,
        }).then(() => {
          this.$router.push({
            path: "/open-success",
          });
        });
      }
    },
  },
};
</script>

<style lang="scss">
.page-open {
  box-sizing: border-box;
  padding: 15px;
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .more-info-img {
    width: 25px;
    height: 25px;
    vertical-align: middle;
  }
  .box1 {
    flex: 1 0 auto;
    height: 50%;
  }
  .llayer {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 10;
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
  .m-radio {
    margin: 20px auto;
    display: block;
    .van-radio-group--horizontal {
      justify-content: center;
    }
  }
  .m-button {
    margin: 30px 0;
    display: block;
    width: 100%;
    button {
      width: 100%;
    }
  }
  .van-field__label--disabled {
    color: #646566;
  }
  .van-field__control--disabled {
    color: #323233;
  }
  .box {
    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: column;
    .ui-title {
      font-size: 16px;
      text-align: center;
      color: red;
    }
    .ui-text {
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.5);
      text-align: center;
    }
  }
  .m-foot {
    text-align: center;
    font-size: 12px;
    bottom: 30px;
    width: 100%;
  }
}
.null-box {
  height: 100vh;
  position: relative;
  .jzz {
    text-align: center;
    font-size: 20px;
    margin-top: 200px;
  }
  .copyright {
    position: absolute;
    bottom: 45px;
    width: 100%;
    text-align: center;
    font-size: 17px;
    color: rgba($color: #000000, $alpha: 0.5);
  }
}
.van-empty__image {
  height: 75px !important;
  display: block;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.van-field--disabled .van-field__label {
  color: #646566;
}
.van-field__control:disabled {
  -webkit-text-fill-color: #323233;
}

.more-layer,
.moreac {
  border-bottom: 1px solid rgba($color: #dedede, $alpha: 0.3);
}
</style>
