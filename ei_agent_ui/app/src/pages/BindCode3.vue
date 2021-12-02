<template>
  <view class="page-bindcode">
    <CInput
      :value.sync="form.codeCardId"
      placeholder="输入码牌信息"
      label="绑定码牌"
      :required="true"
      :disabled="true"
    ></CInput>
    <van-button class="m-button" type="info" @click="onScanCode">
      扫码新增码牌
    </van-button>
    <van-button class="m-button" type="info" @click="onSubmit" v-if="form.codeCardId">
      下一步
    </van-button>
  </view>
</template>

<script>
import CInput from '../components/CInput.vue';
import { get, post } from '../../libs/request';
export default {
  data() {
    return {
      form: {
        codeCardId: '',
        siteId: '',
      },
    };
  },
  components: {
    CInput,
  },
  onLoad(e) {
    this.form.siteId = e.id;
  },
  methods: {
    async onSubmit() {
      this.form.codeCardId = this.form.codeCardId.endsWith(',')
        ? this.form.codeCardId.substring(0, this.form.codeCardId.length - 1)
        : this.form.codeCardId;
      const { code } = await get('agent/site/binding/code_card', this.form);
      if (code === 0) {
        uni.navigateTo({
          url: `BindShop?id=${this.form.siteId}`,
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
      const { data, msg } = await get('agent/site/binding/check/codeCard', {
        codeCardId: codeId,
      });
      if (!data) {
        return uni.showToast({
          icon: 'error',
          title: msg,
        });
      } else {
        this.form.codeCardId += `${codeId},`;
      }
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
  .van-field__label--disabled {
    color: #646566;
  }
  .van-field__control--disabled {
    color: #323233;
  }
}
</style>
