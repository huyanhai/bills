<template>
  <view class="page-box">
    <view class="page-open" v-if="showPage">
      <view class="box1">
        <view class="llayer" @click="hideLayer" v-if="showLayer"></view>
        <Card class="m-card">
          <view class="box">
            <view class="ui-title">{{ shopInfo.siteTitle }}</view>
            <view class="ui-text">为你开票</view>
          </view>
        </Card>
        <view @click="showItem(1)">
          <CInput :value.sync="updateType.name" label="开票类型" :disabled="true" :required="true" placeholder="选择开票类型">
            <van-icon name="arrow-down" />
          </CInput>
        </view>
        <template v-if="updateType.value === 1">
          <view @click="showItem(2)" v-if="shopInfo.specialInvoice !== 2">
            <CInput :value.sync="qiye.invoiceTypeName" label="发票类型" :disabled="true" :required="true" placeholder="选择发票类型">
              <van-icon name="arrow-down" />
            </CInput>
          </view>
          <view class="more-layer more-layer1">
            <CInput @input="inputVal" :value.sync="qiye.title" placeholder="发票抬头" :required="true" label="发票抬头">
              <image src="../static/image/fp.png" @click="getList" class="more-info-img" />
            </CInput>
            <view class="layer" v-if="showLayer">
              <view class="lay-item" v-for="item in list" :key="item.taxNo" @click="setItem(item)">
                {{ item.title }}
              </view>
            </view>
          </view>
          <CInput :value.sync="qiye.taxNo" placeholder="企业税号" :required="true" label="企业税号" />
        </template>
        <template v-if="updateType.value === 2">
          <CInput :value.sync="geren.title" placeholder="姓名" label="姓名" :required="true">
            <image src="../static/image/fp.png" @click="getList" class="more-info-img" />
          </CInput>
        </template>
        <view class="more-layer">
          <CInput :value.sync="receiveEmail" :required="true" placeholder="邮箱地址" label="邮箱地址" @blur="emailBlur" @focus="emailFocus()" />
          <view class="layer" v-if="emailList.length > 0 && showEmailLayer">
            <view class="lay-item" v-for="item in emailList" :key="item" @click="setEmail(item)">
              {{ item }}
            </view>
          </view>
        </view>
        <CInput :value.sync="money" placeholder="消费金额" label="消费金额" type="number" :required="true" />
        <template v-if="updateType.value === 1">
          <CInput :value.sync="qiye.bank" placeholder="开户银行" label="开户银行" />
          <CInput :value.sync="qiye.account" placeholder="银行账号" label="银行账号" />
          <CInput :value.sync="qiye.address" placeholder="地址" label="地址" />
        </template>
        <CInput :value.sync="receivePhone" placeholder="手机号码" label="手机号码" />
        <CInput :value.sync="remarks" placeholder="备注" label="备注" />
        <van-button class="m-button" type="info" @click="onSubmit">
          提 交
        </van-button>
      </view>
      <view class="m-foot">重庆票盟科技有限公司</view>
      <van-popup :show="show" position="bottom" :close-on-click-overlay="false">
        <van-picker
          :columns="[
            { id: 1, name: '企业' },
            { id: 2, name: '个人' },
          ]"
          @confirm="confirmItem"
          @cancel="
            show = false;
            item = null;
          "
          show-toolbar
          value-key="name"
          v-if="item === 1"
        />
        <van-picker
          :columns="[
            { id: 2, name: '普票' },
            { id: 1, name: '专票' },
          ]"
          @cancel="
            show = false;
            item = null;
          "
          @confirm="confirmItem"
          show-toolbar
          value-key="name"
          v-if="item === 2"
        />
      </van-popup>
      <van-popup :show="show1" position="bottom" :close-on-click-overlay="false">
        <van-picker :columns="companyList" @confirm="confirmItem1" @cancel="show1 = false" show-toolbar value-key="title" />
      </van-popup>
    </view>
    <view v-else class="null-box">
      <van-empty :image="require('../static/image/logo.png')" />
      <view class="jzz">努力加载中...</view>
      <view class="copyright">重庆票盟科技有限公司</view>
    </view>
  </view>
</template>

<script>
import CInput from "../components/CInput.vue";
import { post, get } from "../../libs/request";
import Card from "../components/Card.vue";
import { checkPhone, checkEmail } from "../../libs/utils";
import { userLogin } from "../../libs/auth";
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
  async onLoad(e) {
    let authCode = uni.getStorageSync("authCode");
    if (!authCode) {
      await userLogin();
    }
    await this.checkAuth();
    let datas = decodeURIComponent((e || {}).q);
    if (datas && datas !== "undefined") {
      let code = datas.split("/");
      this.codeId = code[code.length - 1] || "";
    }
    const { codeId } = e;
    if (codeId) {
      this.codeId = codeId;
    }
    if (this.codeId) {
      await this.checkId();
      this.getShopInfo();
    }
  },
  onShow() {
    const taitou = uni.getStorageSync("taitou");
    if (taitou) {
      this.qiye = Object.assign(this.qiye, taitou);
    }
  },
  methods: {
    confirmItem1(e) {
      if (this.updateType.value === 1) {
        this.qiye = Object.assign(this.qiye, e.detail.value);
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
        uni.showModal({
          title: `上次开票抬头`,
          content: `${data.title}${data.taxNo}`,
          confirmText: "继续开票",
          cancelText: "取消开票",
          success: async function(res) {
            if (res.confirm) {
              vm.qiye.title = data.title;
              vm.qiye.taxNo = data.taxNo;
              vm.qiye.address = data.address;
              vm.receivePhone = data.phone;
              vm.qiye.bank = data.bank;
              vm.qiye.account = data.account;
            }
          },
        });
      }
    },
    checkAuth() {
      return get("p/validation/token");
    },
    emailFocus() {
      this.showEmailLayer = true;
      // if (!this.receiveEmail) {
      //   this.showEmailLayer = true;
      // }
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
      const { code, msg } = await get(`wechat/get/code/${this.codeId}`);
      if (code === 0) {
        this.showPage = true;
        this.getCompany();
      } else {
        this.msg = msg;
      }
    },
    hideLayer() {
      this.showLayer = false;
    },
    inputVal(e) {
      if (!e) {
        this.showLayer = false;
        return;
      }
      this.getData(e);
    },
    radioChange(e) {
      this.updateType = e.detail;
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
          this.updateType.value = e.detail.value.id;
          this.updateType.name = e.detail.value.name;
          break;
        case 2:
          this.qiye.invoiceType = e.detail.value.id;
          this.qiye.invoiceTypeName = e.detail.value.name;
          break;
        default:
          break;
      }
      this.show = false;
      this.item = null;
    },
    searchTitle() {
      if (!this.qiye.title) {
        return uni.showToast({
          title: "请输入内容",
          duration: 2000,
          icon: "none",
        });
      }
      uni.navigateTo({
        url: `SearchTitle?companyCloudTitle=${this.qiye.title}`,
      });
    },
    async getData(newVal) {
      if (!newVal) return;
      const { data } = await get(
        `wechat/get/zyh/companyCloudTitle?companyTitle=${this.companyCloudTitle}`,
        {
          companyTitle: newVal,
        },
        false
      );
      if (data && data.length > 0) {
        this.showLayer = true;
        this.list = data;
      }
    },
    async getShopInfo() {
      const { data, code } = await get(`wechat/get/site/${this.codeId}`, {});
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
        return uni.showToast({
          title: "邮箱格式错误",
          duration: 2000,
          icon: "none",
        });
      }
      if (!this.money) {
        return uni.showToast({
          title: "请输入金额",
          duration: 2000,
          icon: "none",
        });
      }
      let from = {};
      if (this.updateType.value === 1) {
        if (!this.qiye.title) {
          return uni.showToast({
            title: "请输入发票抬头",
            duration: 2000,
            icon: "none",
          });
        } else {
          from = Object.assign({}, this.qiye);
        }
      }
      if (this.updateType.value === 2) {
        from = Object.assign({}, this.geren, {
          invoiceType: 2,
        });
      }
      if (from.taxNo) {
        if (from.taxNo.length < 14 || from.taxNo.length > 25) {
          return uni.showToast({
            title: "企业税号长度在14-25",
          });
        }
      }
      from = Object.assign(from, {
        codeId: this.codeId,
        receiveEmail: this.receiveEmail,
        receivePhone: this.receivePhone,
        remarks: this.remarks,
        buyType: this.updateType.value,
        money: this.money,
      });
      console.log(from);
      const { code } = await post("wechat/put/invoice", from);
      if (code === 0) {
        uni.showModal({
          title: "提交成功",
          content: "抬头提交成功，请通知商家开票",
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              uni.navigateTo({
                url: "OpenSuccess",
              });
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.page-open {
  box-sizing: border-box;
  padding: 30rpx;
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .more-info-img {
    width: 50rpx;
    height: 50rpx;
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
    .ui-input {
      z-index: 10;
    }
    .layer {
      position: absolute;
      background: #dedede;
      z-index: 100;
      padding: 30rpx;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      max-height: 500rpx;
      overflow-y: scroll;
      .lay-item {
        height: 60rpx;
        line-height: 60rpx;
        font-size: 28rpx;
        margin-bottom: 20rpx;
      }
    }
  }
  .more-layer1 {
    z-index: 100;
  }
  .m-radio {
    margin: 40rpx auto 40rpx auto;
    display: block;
    .van-radio-group--horizontal {
      justify-content: center;
    }
  }
  .m-button {
    margin-top: 60rpx;
    display: block;
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
      font-size: 32rpx;
      text-align: center;
      color: red;
    }
    .ui-text {
      font-size: 24rpx;
      color: rgba($color: #000000, $alpha: 0.5);
      text-align: center;
    }
  }
  .m-foot {
    text-align: center;
    font-size: 24rpx;
    bottom: 60rpx;
    width: 100%;
  }
}
.null-box {
  height: 100vh;
  position: relative;
  .jzz {
    text-align: center;
    font-size: 40rpx;
    margin-top: 200rpx;
  }
  .copyright {
    position: absolute;
    bottom: 90rpx;
    width: 100%;
    text-align: center;
    font-size: 34rpx;
    color: rgba($color: #000000, $alpha: 0.5);
  }
}
.van-empty__image {
  height: 150rpx !important;
  display: block;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
