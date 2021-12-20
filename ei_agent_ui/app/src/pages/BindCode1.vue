<template>
  <view class="page-bindcode form">
    <CityPicker
      placeholder="请输入门店地址"
      :defaultVal="value"
      label="商户地址"
      @pickerInfo="pickerInfo"
    />
    <CInput
      :value.sync="form.siteAddress"
      placeholder="请输入门店详细地址"
      label="详细地址"
      :required="true"
    />
    <CInput :value.sync="form.drawer" placeholder="请输入开票人" label="开票人" :required="true" />
    <CInput :value.sync="form.checker" placeholder="请输入复核人" label="复核人" :required="true" />
    <CInput :value.sync="form.payee" placeholder="请输入收款人" label="收款人" :required="true" />
    <CInput
      :value.sync="name"
      placeholder="请输入商户名称"
      label="商户名称"
      v-if="name"
      :disabled="true"
      class="no-disable"
    />
    <CInput :value.sync="form.sellerBank" placeholder="请输入开户行" label="开户行" />
    <CInput :value.sync="form.sellerAccount" placeholder="请输入银行账号" label="银行账号" />
    <van-button class="m-button" type="info" @click="onSubmit">
      {{ isEdit ? '确定修改' : '下一步' }}
    </van-button>
  </view>
</template>

<script>
import CInput from '../components/CInput.vue';
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';
import { BASE_URL } from '../../config';
import CityPicker from '../components/CityPicker.vue';
export default {
  data() {
    return {
      form: {
        siteId: '',
        sellerBank: '',
        sellerAccount: '',
        siteAddress: '',
        drawer: '',
        checker: '',
        payee: '',
      },
      value: '',
      keyMap: {
        sellerBank: '开户行',
        sellerAccount: '银行账号',
        siteAddress: '详细地址',
        drawer: '开票人',
        checker: '复核人',
        payee: '收款人',
      },
      isEdit: false,
      name: '',
    };
  },
  components: {
    CInput,
    Card,
    CityPicker,
  },
  onLoad(e) {
    this.form.siteId = e.id;
    if (e.query) {
      const id = e.query;
      delete this.form.phone;
      this.isEdit = true;
      this.getSiteInfo(id);
      uni.setNavigationBarTitle({
        title: '修改信息',
      });
    }
  },
  methods: {
    async getSiteInfo(id) {
      const { data } = await get('agent/query/site_info/id', {
        siteId: id,
      });
      if (data) {
        this.form.sellerBank = data.sellerBank;
        this.form.sellerAccount = data.sellerAccount;
        this.form.siteAddress = data.siteAddress;
        this.form.drawer = data.drawer;
        this.form.checker = data.checker;
        this.form.payee = data.payee;
        this.form.siteId = data.id;
        this.form.provinceId = data.provinceId;
        this.form.cityId = data.cityId;
        this.form.countyId = data.countyId;
        this.name = data.siteName;
        this.value = `${data.province || ''}-${data.city || ''}-${data.county || ''}`;
      }
    },
    pickerInfo(e) {
      const [one, two, three] = e;
      if (one.id) {
        this.form.provinceId = one.id;
      }
      if (two.id) {
        this.form.cityId = two.id;
      }
      if (three.id) {
        this.form.countyId = three.id;
      }
    },
    async onSubmit() {
      for (let item in this.form) {
        if (!this.form[item] && !['sellerBank', 'sellerAccount'].includes(item)) {
          return uni.showToast({
            title: `${this.keyMap[item]}为空,请完善数据`,
            duration: 2000,
            icon: 'none',
          });
        }
      }
      if (!this.form.provinceId) {
        return uni.showToast({
          title: '请选择商户地址',
          icon: 'none',
        });
      }

      // if (!this.form.sellerBank) {
      //   return uni.showToast({
      //     title: '请输入开户行',
      //     duration: 2000,
      //     icon: 'none',
      //   });
      // }
      // if (!this.form.sellerAccount) {
      //   return uni.showToast({
      //     title: '请输入银行账号',
      //     duration: 2000,
      //     icon: 'none',
      //   });
      // }
      if (this.form.drawer === this.form.checker) {
        return uni.showToast({
          title: '开票人和复核人不能相同',
          duration: 2000,
          icon: 'none',
        });
      }
      const { code, msg } = await post('agent/up/make/invoiceinfo', this.form);
      if (code === 0) {
        if (this.isEdit) {
          return uni.showToast({
            title: '修改成功',
          });
        }
        uni.navigateTo({
          url: `BindCode3?id=${this.form.siteId}`,
        });
      }
    },
    onScanCode() {
      let that = this;
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode', 'barCode'],
        success: function(res) {
          let url = res.result;
          let code = url.split('/') || [];
          let codeId = code[code.length - 1];
          if (!code) {
            return uni.showToast({
              title: '二维码格式错误',
              duration: 2000,
              icon: 'error',
            });
          }
          that.checkId(codeId);
        },
      });
    },
    async checkId(codeId) {
      const { data, msg } = await get('agent/query/code/binding/status', {
        codeId: codeId,
      });
      if (!data) {
        return uni.showToast({
          icon: 'error',
          title: msg,
        });
      } else {
        this.form.codeId = `${codeId},`;
        this.form.codeId = this.form.codeId.substring(0, this.form.codeId.length - 1);
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
.name {
  text-align: center;
  color: red;
  font-size: 38rpx;
  font-weight: bold;
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
    display: block;
    margin-top: 60rpx;
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
</style>
