<template>
  <view class="page-bindcode">
    <!-- <template>
      <van-cell title="单元格" value="内容" size="large" />
    </template> -->
    <CInput
      :value.sync="form.title"
      placeholder="请输入企业名称全称"
      label="商户名称"
    />
    <CInput
      :value.sync="form.taxNo"
      placeholder="请输入15-20位商户税号"
      type="number"
      label="商户税号"
    />
    <view @click="showItem(1)">
      <CInput
        :value.sync="form.taxPanelTypeText"
        label="选择税盘类型"
        :disabled="true"
      >
        <van-icon name="arrow-down" />
      </CInput>
    </view>
    <CInput
      :value.sync="form.machineCode"
      placeholder="请输入税盘编号"
      label="税盘编号"
    />
    <CInput
      :value.sync="form.legalPerson"
      placeholder="请输入法人姓名"
      label="法人姓名"
    />
    <CInput
      :value.sync="form.phone"
      placeholder="请输入手机号码"
      label="商户手机号"
      type="number"
    />
    <CInput
      :value.sync="form.address"
      placeholder="请输入门店地址"
      label="商户地址"
    />
    <view @click="showItem(2)">
      <CInput
        :value.sync="form.industryCategoryText"
        label="选择行业类别"
        :disabled="true"
      >
        <van-icon name="arrow-down" />
      </CInput>
    </view>
    <view @click="showItem(3)">
      <CInput
        :value.sync="form.specialInvoiceText"
        label="支持专票"
        :disabled="true"
      >
        <van-icon name="arrow-down" />
      </CInput>
    </view>
    <CInput
      :value.sync="form.codeId"
      placeholder="输入码牌信息"
      label="绑定码牌"
      :disabled="true"
    >
    </CInput>
    <view class="upload-box">
      <view class="col-l">
        <view class="uploads" @click="uploads(1)">
          <image :src="form.licenseUrl" mode="" v-if="form.licenseUrl" />
          <image src="../static/image/upload.png" v-else />
        </view>
        <text>营业执照</text>
      </view>
      <view class="col-l">
        <view class="uploads" @click="uploads(2)">
          <image :src="form.shopImage" mode="" v-if="form.shopImage" />
          <image src="../static/image/upload.png" v-else />
        </view>
        <text>门头照</text>
      </view>
    </view>
    <view class="tips">温馨提示：商户登录密码默认商户手机号</view>
    <van-button class="m-button" type="info" @click="onSubmit">
      提 交
    </van-button>
    <van-popup :show="show" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="columns1"
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
        :columns="columns2"
        @cancel="
          show = false;
          item = null;
        "
        @confirm="confirmItem"
        show-toolbar
        value-key="name"
        v-if="item === 2"
      />
      <van-picker
        :columns="columns3"
        @change="onChange"
        @cancel="
          show = false;
          item = null;
        "
        @confirm="confirmItem"
        show-toolbar
        value-key="name"
        v-if="item === 3"
      />
    </van-popup>
  </view>
</template>

<script>
import CInput from "../components/CInput.vue";
import Card from "../components/Card.vue";
import { get, post } from "../../libs/request";
import { BASE_URL } from "../../config";
import { checkPhone } from "../../libs/utils";
export default {
  data() {
    return {
      startNo: "",
      fileList: [],
      item: null,
      show: false,
      columns1: [
        { id: 1, name: "U_KEY" },
        { id: 2, name: "税控盘" },
      ],
      columns2: [
        { id: 1, name: "餐饮" },
        { id: 2, name: "酒店" },
      ],
      columns3: [
        { id: 1, name: "支持" },
        { id: 2, name: "不支持" },
      ],
      form: {
        title: "",
        taxNo: "",
        machineCode: "",
        legalPerson: "",
        address: "",
        phone: "",
        taxPanelType: "",
        taxPanelTypeText: "",
        industryCategory: "",
        industryCategoryText: "",
        specialInvoice: "",
        specialInvoiceText: "",
        licenseUrl: "",
        shopImage: "",
        codeId: "",
      },
    };
  },
  components: {
    CInput,
    Card,
  },
  async onLoad(e) {
    let datas = decodeURIComponent((e || {}).q);
    if (datas && datas !== "undefined") {
      let code = datas.split("/");
      this.codeId = code[code.length - 1] || "";
    }
    const { codeId } = e;
    if (codeId) {
      this.form.codeId = codeId;
    }
    let authCode = uni.getStorageSync("authCode");
    if (!authCode) {
      await userLogin()
    }
  },
  methods: {
    async onSubmit() {
      for (let item in this.form) {
        if (!this.form[item] && item !== "phone") {
          return uni.showToast({
            title: "请完善数据",
            duration: 2000,
            icon: "error",
          });
        }
      }
      if (!checkPhone(this.form.phone)) {
        return uni.showToast({
          title: "手机号码格式错误",
          duration: 2000,
          icon: "none",
        });
      }
      const { data } = await post("wechat/bind/site", this.form);
      if (data === 0) {
        uni.showToast({
          title: "注册成功",
          duration: 2000,
        });
        uni.navigateTo({
          url: `OpenCard?codeId=${this.form.codeId}`,
        });
      }
    },
    onChange() {},
    onClose() {},
    showItem(item) {
      this.item = item;
      this.show = true;
    },
    onScanCode() {
      let that = this;
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ["qrCode", "barCode"],
        success: function(res) {
          let url = res.result;
          let code = url.split("/") || [];
          let codeId = code[code.length - 1];
          if (!code) {
            return uni.showToast({
              title: "二维码格式错误",
              duration: 2000,
              icon: "error",
            });
          }
          that.checkId(codeId);
        },
      });
    },
    async checkId(codeId) {
      const { data, msg } = await get("agent/query/code/binding/status", {
        codeId: codeId,
      });
      if (!data) {
        return uni.showToast({
          icon: "error",
          title: msg,
        });
      } else {
        this.form.codeId += `${codeId},`;
        this.form.codeId = this.form.codeId.substring(
          0,
          this.form.codeId.length - 1
        );
      }
    },
    confirmItem(e) {
      switch (this.item) {
        case 1:
          this.form.taxPanelType = e.detail.value.id;
          this.form.taxPanelTypeText = e.detail.value.name;
          break;
        case 2:
          this.form.industryCategory = e.detail.value.id;
          this.form.industryCategoryText = e.detail.value.name;
          break;
        case 3:
          this.form.specialInvoice = e.detail.value.id;
          this.form.specialInvoiceText = e.detail.value.name;
          break;
        default:
          break;
      }
      this.show = false;
      this.item = null;
    },
    uploads(type) {
      let that = this;
      uni.chooseImage({
        success: (chooseImageRes) => {
          uni.showLoading({
            title: "加载中",
          });
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: `${BASE_URL}agent/upload`, //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            header: {
              token: String(uni.getStorageSync("authCode")),
            },
            name: "file",
            success: (uploadFileRes) => {
              const { data } = JSON.parse(uploadFileRes.data);
              switch (type) {
                case 1:
                  that.form.licenseUrl = data;
                  break;
                case 2:
                  that.form.shopImage = data;
                  break;
                default:
                  break;
              }
            },
            complete: () => {
              uni.hideLoading();
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
.page-bindcode {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 30rpx;
  background: #fff;
  .m-card {
    margin-bottom: 30rpx;
    display: block;
  }
  .tips {
    font-size: 26rpx;
    color: red;
    display: block;
    margin-bottom: 60rpx;
  }
  .upload-box {
    margin: 30rpx 0;
    display: flex;
    .col-l {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 28rpx;
      .uploads {
        width: 180rpx;
        height: 180rpx;
        margin-right: 30rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .m-button {
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
}
</style>
