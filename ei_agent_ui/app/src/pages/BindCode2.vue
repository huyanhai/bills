<template>
  <view class="page-bindcode">
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
    <van-button class="m-button" type="info" @click="onSubmit">
      {{ isEdit ? '确定修改' : '下一步' }}
    </van-button>
  </view>
</template>

<script>
import { get, post } from '../../libs/request';
import { BASE_URL } from '../../config';
export default {
  data() {
    return {
      form: {
        siteId: '',
        licenseUrl: '',
        shopImage: '',
      },
      keyMap: {
        licenseUrl: '营业执照',
        shopImage: '门头照',
      },
      isEdit: false,
    };
  },
  onLoad(e) {
    this.form.siteId = e.id;
    if (e.query) {
      const id = e.query;
      console.log(id);
      this.getSiteInfo(id);
      this.isEdit = true;
      uni.setNavigationBarTitle({
        title: '修改图片',
      });
    }
  },
  methods: {
    async getSiteInfo(id) {
      const { data } = await get('agent/query/site_info/id', {
        siteId: id,
      });
      if (data) {
        this.form.siteId = data.id;
        this.form.licenseUrl = data.licenseUrl;
        this.form.shopImage = data.shopImage;
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
      const { code, msg } = await post('agent/up/site/businessLicense', this.form);
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
    flex-direction: column;
    .col-l {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 34rpx;
      margin-bottom: 30rpx;
      text-align: center;
      .uploads {
        width: 360rpx;
        height: 360rpx;
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
