<template>
  <view class="add-taitou">
    <view @click="checkType">
      <CInput :value.sync="from.typename" label="抬头类型" :disabled="true" :required="true" placeholder="选择抬头类型">
        <van-icon name="arrow-down" />
      </CInput>
    </view>
    <CInput :value.sync="from.title" placeholder="名称" label="名称" v-if="from.type === 2" :required="true">
      <image src="../static/image/wechart.png" v-if="!id" @click="shopMore" class="more-info" />
    </CInput>
    <template v-if="from.type === 1">
      <view class="more-layer more-layer1">
        <CInput :value.sync="from.title" placeholder="企业名称" label="企业名称" @input="inputVal" :required="true">
          <image src="../static/image/wechart.png" v-if="!id" @click="shopMore" class="more-info" />
        </CInput>
        <view class="layer" v-if="showLayer">
          <view class="lay-item" v-for="item in list" :key="item.taxNo" @click="setItem(item)">
            {{ item.title }}
          </view>
        </view>
      </view>
      <CInput :value.sync="from.taxNo" placeholder="企业税号" label="企业税号" :required="true" />
      <CInput :value.sync="from.address" placeholder="企业办公地址" label="企业办公地址" />
      <CInput :value.sync="from.phone" placeholder="企业电话" label="企业电话" />
      <CInput :value.sync="from.bank" placeholder="企业开户行" label="企业开户行" />
      <CInput :value.sync="from.account" placeholder="企业银行账号" label="企业银行账号" />
    </template>
    <van-button class="m-button" type="info" @click="onSubmit">
      提 交
    </van-button>
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
  </view>
</template>

<script>
import CInput from "../components/CInput.vue";
import { post, get } from "../../libs/request";

export default {
  data() {
    return {
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
  onLoad(e) {
    const { id } = e;
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
      if (!e) {
        this.showLayer = false;
        return;
      }
      this.getData(e);
    },
    async getData(newVal) {
      if (!newVal) return;
      const { data } = await get(
        `wechat/get/zyh/companyCloudTitle`,
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
    async onSubmit() {
      let form = {
        title: this.from.title,
        type: this.from.type,
      };
      if (this.from.type === 1) {
        form = Object.assign({}, this.from);
      }
      if (!this.from.title) {
        return uni.showToast({
          title: "请输入名称",
          icon: "none",
        });
      }
      if (this.from.type === 1 && !this.from.taxNo) {
        return uni.showToast({
          title: "请输入税号",
          icon: "none",
        });
      }
      if (this.id) {
        form.id = this.id;
      }
      const { code, data } = await post(`wechat/user_history_company/add`, form);
      if (code === 0) {
        uni.showModal({
          content: this.id ? "修改成功" : "新增成功",
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              uni.navigateBack();
            }
          },
        });
      }
    },
    setItem(item) {
      this.from = Object.assign(this.from, item);
      this.showLayer = false;
    },
    confirmItem(e) {
      this.show = false;
      this.from.type = e.detail.value.id;
      this.from.typename = e.detail.value.name;
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
  padding: 30rpx;
  .m-button {
    margin-top: 30rpx;
    display: block;
    button {
      width: 100%;
    }
  }
  .more-info {
    width: 50rpx;
    height: 50rpx;
    vertical-align: middle;
  }
  .van-field__label--disabled {
    color: #646566;
  }
  .van-field__control--disabled {
    color: #323233;
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
}
</style>
