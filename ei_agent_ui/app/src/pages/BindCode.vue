<template>
  <view class="page-bindcode form">
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
    <CInput
      :value.sync="name"
      placeholder="请输入商户名称"
      label="商户名称"
      v-if="name"
      :disabled="true"
      class="no-disable"
    />
    <view class="m-layer">
      <CInput
        :value.sync="form.title"
        placeholder="请输入公司名称全称"
        label="公司名称"
        :required="true"
        @input="getTitle"
      />
      <view class="layer" v-if="showLayer">
        <view class="lay-item" v-for="item in list" :key="item.taxNo" @click="setItem(item)">
          {{ item.title }}
        </view>
      </view>
    </view>
    <CInput
      :value.sync="form.siteName"
      placeholder="请输入企业名称全称"
      label="商户名称"
      :required="true"
      v-if="!isEdit"
    />
    <CInput
      :value.sync="form.taxNo"
      placeholder="请输入15-20位商户税号"
      label="商户税号"
      :required="true"
    />
    <view @click="showItem(1)">
      <CInput
        :value.sync="form.taxPanelTypeText"
        label="税盘类型"
        :disabled="true"
        :required="true"
      >
        <van-icon name="arrow-down" />
      </CInput>
    </view>
    <CInput
      :value.sync="form.machineCode"
      placeholder="请输入税盘编号"
      label="税盘编号"
      :required="true"
    />
    <CInput
      :value.sync="form.legalPerson"
      placeholder="请输入法人姓名"
      label="法人姓名"
      :required="true"
    />
    <CInput
      :value.sync="form.phone"
      placeholder="请输入手机号码"
      label="商户手机号"
      type="number"
      :required="true"
      v-if="!isEdit"
    />
    <view @click="showItem(2)">
      <CInput
        :value.sync="form.industryCategoryText"
        label="行业类别"
        :disabled="true"
        :required="true"
      >
        <van-icon name="arrow-down" />
      </CInput>
    </view>
    <view @click="showItem(3)">
      <CInput
        :value.sync="form.specialInvoiceText"
        label="支持专票"
        :disabled="true"
        :required="true"
        placeholder="请选择是否支持专票"
      >
        <van-icon name="arrow-down" />
      </CInput>
    </view>
    <CInput
      :value.sync="form.servicePhone"
      placeholder="请输入客服电话"
      label="客服电话"
      :required="true"
    />
    <van-button class="m-button" type="info" @click="onSubmit">
      {{ isEdit ? '确定修改' : '下一步' }}
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
import CInput from '../components/CInput.vue';
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';
import CityPicker from '../components/CityPicker.vue';
import { checkPhone } from '../../libs/utils';
import { BASE_URL } from '../../config';
export default {
  data() {
    return {
      startNo: '',
      fileList: [],
      item: null,
      show: false,
      show1: false,
      columns1: [
        { id: 1, name: 'U_KEY' },
        { id: 2, name: '税控盘' },
      ],
      columns2: [
        { id: 0, name: '餐饮' },
        { id: 1, name: '酒店' },
        { id: 2, name: '其他' },
      ],
      columns3: [
        { id: 1, name: '支持' },
        { id: 2, name: '不支持' },
      ],
      hyType: {
        0: '餐饮',
        1: '酒店',
        2: '其他',
      },
      form: {
        title: '',
        siteName: '',
        taxNo: '',
        machineCode: '',
        legalPerson: '',
        phone: '',
        taxPanelType: '1',
        taxPanelTypeText: 'U_KEY',
        industryCategory: '0',
        industryCategoryText: '餐饮',
        specialInvoice: '',
        specialInvoiceText: '',
        licenseUrl: '',
        shopImage: '',
        servicePhone: '',
      },
      infos: {
        text: '',
        detail: [],
      },
      areaValue: '',
      keyMap: {
        title: '公司名称',
        siteName: '商户名称',
        taxNo: '商户税号',
        machineCode: '税盘编号',
        legalPerson: '法人姓名',
        phone: '商户手机号',
        taxPanelType: '税盘类型',
        taxPanelTypeText: '税盘类型',
        industryCategory: '行业类型',
        industryCategoryText: '行业类型',
        specialInvoice: '支持专票',
        specialInvoiceText: '支持专票',
        licenseUrl: '营业执照',
        shopImage: '门头照',
        servicePhone: '客服电话',
      },
      isEdit: false,
      name: '',
      showLayer: false,
      list: [],
    };
  },
  components: {
    CInput,
    Card,
    CityPicker,
  },
  onLoad(e) {
    if (e.query) {
      const id = e.query;
      this.isEdit = true;
      this.getSiteInfo(id);
      uni.setNavigationBarTitle({
        title: '修改信息',
      });
    }
  },
  methods: {
    blur() {
      const vm = this;
      setTimeout(() => {
        vm.showLayer = false;
      }, 500);
    },
    setItem(item) {
      // this.form.legalPerson = item.legalPerson;
      this.form.title = item.title;
      this.form.taxNo = item.taxNo;
      this.showLayer = false;
    },
    async getTitle(e) {
      const { data, code } = await get(
        'agent/get/zyh/companyCloudTitle',
        {
          companyTitle: e,
        },
        '',
        false,
      );
      if (code === 0 && data && data.length > 0) {
        this.showLayer = true;
        this.list = data;
      } else {
        this.showLayer = false;
      }
    },
    async getSiteInfo(id) {
      const { data } = await get('agent/query/site_info/id', {
        siteId: id,
      });
      if (data) {
        this.form.title = data.siteTitle;
        this.form.siteName = data.siteName;
        this.form.taxNo = data.siteTaxNo;
        this.form.taxPanelType = String(data.taxPanelType || 1);
        this.form.taxPanelTypeText = data.taxPanelType === 1 ? 'U_KEY' : '税控盘';
        this.form.machineCode = data.machineCode;
        this.form.legalPerson = data.legalPerson;
        this.form.industryCategory = String(data.industryCategory || 0);
        this.form.industryCategoryText = this.hyType[data.industryCategory];
        this.form.specialInvoice = String(data.specialInvoice || 1);
        this.form.specialInvoiceText = data.specialInvoice === 1 ? '支持' : '不支持';
        this.form.siteId = data.id;
        this.name = data.siteName;
        this.form.licenseUrl = data.licenseUrl;
        this.form.shopImage = data.shopImage;
        this.form.servicePhone = data.servicePhone;
        delete this.form.phone;
      }
    },
    async onSubmit() {
      for (let item in this.form) {
        if (!this.form[item]) {
          return uni.showToast({
            title: `${this.keyMap[item]}为空,请完善数据`,
            duration: 2000,
            icon: 'none',
          });
        }
      }
      if (!checkPhone(this.form.phone) && !this.isEdit) {
        return uni.showToast({
          title: '手机号格式错误',
        });
      }
      const url = this.isEdit ? 'agent/up/site/account' : 'agent/add/site/account';
      const { code, msg, data } = await post(url, this.form);
      if (code === 0) {
        if (this.isEdit) {
          return uni.showToast({
            title: '修改成功',
          });
        }
        uni.navigateTo({
          url: `BindCode1?id=${data}`,
        });
      }
    },
    showItem(item) {
      this.item = item;
      this.show = true;
    },
    confirmItem(e) {
      switch (this.item) {
        case 1:
          this.form.taxPanelType = String(e.detail.value.id);
          this.form.taxPanelTypeText = e.detail.value.name;
          break;
        case 2:
          this.form.industryCategory = String(e.detail.value.id);
          this.form.industryCategoryText = e.detail.value.name;
          break;
        case 3:
          this.form.specialInvoice = String(e.detail.value.id);
          this.form.specialInvoiceText = e.detail.value.name;
          break;
        default:
          break;
      }
      this.show = false;
      this.item = null;
    },
    async identify(url) {
      const { data, code } = await get('agent/business_license/identify', {
        imageUrl: url,
      });
      if (code === 0) {
        this.form.legalPerson = data.legalPerson;
        this.form.title = data.name;
        this.form.taxNo = data.registerNumber;
      }
    },
    uploads(type) {
      let that = this;
      uni.chooseImage({
        success: chooseImageRes => {
          uni.showLoading({
            title: '加载中',
          });
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: `${BASE_URL}agent/upload`, //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            header: {
              token: String(uni.getStorageSync('authCode')),
            },
            name: 'file',
            success: uploadFileRes => {
              const { data } = JSON.parse(uploadFileRes.data);
              switch (type) {
                case 1:
                  that.form.licenseUrl = data;
                  that.identify(data);
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
.form {
  width: 100%;
  box-sizing: border-box;
  padding: 0 60rpx;
  .ui-input {
    margin-bottom: 30rpx;
    display: block;
  }
}
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
      margin-right: 30rpx;
      text-align: center;
      .uploads {
        width: 180rpx;
        height: 180rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .m-button {
    margin-top: 60rpx;
    display: block;
    button {
      width: 100%;
    }
  }
  .no-disable {
    .van-field__label--disabled {
      color: #646566;
    }
    .van-field__control--disabled {
      color: #a8a8a8;
    }
  }
  .van-field__label--disabled {
    color: #646566;
  }
  .van-field__control--disabled {
    color: #323233;
  }
}
.m-layer {
  position: relative;
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
    top: 80rpx;
    .lay-item {
      height: 60rpx;
      line-height: 60rpx;
      font-size: 28rpx;
      margin-bottom: 20rpx;
    }
  }
}
</style>
