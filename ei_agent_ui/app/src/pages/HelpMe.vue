<template>
  <view class="page-bindcode form">
    <CInput
      :value.sync="form.siteName"
      placeholder="请输入商户名称"
      label="商户名称"
      :required="true"
    />
    <CInput :value.sync="form.phone" placeholder="请输入手机号" label="手机号" :required="true" />
    <CInput :value.sync="form.name" placeholder="请输入联系人" label="联系人" :required="true" />
    <CityPicker placeholder="请输入地址" label="地址" @pickerInfo="pickerInfo" />
    <CInput
      :value.sync="form.siteAddress"
      placeholder="请输入详细地址"
      label="详细地址"
      :required="true"
    />
    <view @click="show = true">
      <CInput
        :value.sync="installIdText"
        placeholder="请选择安装人"
        label="安装人"
        :disabled="true"
        :required="true"
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
      确定
    </van-button>
    <van-popup :show="show" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="columns"
        @confirm="confirmItem"
        @cancel="show = false"
        show-toolbar
        value-key="name"
      />
    </van-popup>
  </view>
</template>

<script>
import CInput from '../components/CInput.vue';
import { get, post } from '../../libs/request';
import CityPicker from '../components/CityPicker.vue';
export default {
  data() {
    return {
      show: false,
      installIdText: '',
      form: {
        siteName: '',
        phone: '',
        name: '',
        siteAddress: '',
        provinceId: '',
        installId: '',
        servicePhone: '',
      },
      keyMap: {
        siteName: '商户名称',
        phone: '手机号',
        name: '联系人',
        provinceId: '地址',
        siteAddress: '详细地址',
        installId: '安装人',
        servicePhone: '客服电话',
      },
      columns: [],
    };
  },
  components: {
    CInput,
    CityPicker,
  },
  onLoad(e) {
    this.getSet();
  },
  methods: {
    async getSet() {
      const { code, data } = await get('agent/help/people');
      if (code === 0) {
        this.columns = data;
      }
    },
    confirmItem(e) {
      this.form.installId = e.detail.value.id;
      this.installIdText = e.detail.value.name;
      this.show = false;
    },
    pickerInfo(e) {
      const [one, two, three] = e;
      if (one.id) {
        this.form.provinceId = Number(one.id || 0);
      }
      if (two.id) {
        this.form.cityId = Number(two.id || 0);
      }
      if (three.id) {
        this.form.countyId = Number(three.id || 0);
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

      const { code, msg } = await post('agent/add/help/order', this.form);
      if (code === 0) {
        // uni.navigateTo({
        //   url: `BindCode2?id=${this.form.siteId}`,
        // });
        uni.showToast({
          title: '提交成功',
        });
      }
    },
  },
};
</script>

<style lang="scss">
.form {
  width: 100%;
  margin: 60rpx 0;
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
    display: block;
    margin-top: 60rpx;
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
