<template>
  <view class="page-bindshop">
    <view class="search-box">
      <van-search
        :value="value"
        label="开票项目"
        placeholder="请输入搜索关键词"
        use-action-slot
        :clearable="false"
        @change="onChange"
        @focus="getRecomment"
        @blur="searchBlur"
      >
        <view slot="action" @click="onSearch">搜索</view>
      </van-search>
      <view class="layout-box" v-if="showLayer">
        <view class="item" v-for="item in list" :key="item.code" @click="setItem(item)">
          {{ item.title }}
        </view>
      </view>
    </view>
    <view class="r-box" v-if="rList.length > 0">
      <van-radio-group @change="onRadioChange" :value="rValue">
        <van-radio :name="item.code" :data-list="item" v-for="item in rList" :key="item.taxNo">
          <view class="box">
            <view class="ui-title">{{ item.title }}</view>
            <view class="ui-text">{{ item.address }}</view>
          </view>
        </van-radio>
      </van-radio-group>
      <van-button class="m-button" type="info" @click="onSubmit">
        确定
      </van-button>
    </view>
    <van-dialog
      use-slot
      :show="show"
      show-cancel-button
      @confirm="dialogConfirm"
      :overlay="true"
      @cancel="show = false"
    >
      <view class="dialog-box">
        <CInput
          :value.sync="modelItem.title"
          placeholder="请输入手机号"
          label="商品名称"
          :disabled="true"
        />
        <CInput
          :value.sync="modelItem.code"
          placeholder="请输入手机号"
          label="税收编码"
          :disabled="true"
        />
        <CInput
          :value.sync="modelItem.taxRate"
          placeholder="请输入手机号"
          label="费率"
          use-button-slot
          >%
        </CInput>
      </view>
    </van-dialog>
  </view>
</template>

<script>
import { get, post } from '../../libs/request';
import CInput from '../components/CInput.vue';
export default {
  data() {
    return {
      show: false,
      value: '',
      rValue: '',
      list: [],
      rList: [],
      id: null,
      showLayer: false,
      modelItem: {},
      pageType: null,
    };
  },
  components: {
    CInput,
  },
  onLoad(e) {
    const { id, type } = e;
    if (id) {
      this.id = id;
    }
    if (type) {
      this.pageType = type;
    }
  },
  methods: {
    searchBlur() {
      const vm = this;
      setTimeout(() => {
        vm.showLayer = false;
      }, 100);
    },
    async getRecomment(e) {
      if (this.value) return;
      if (!e.detail) {
        this.list = [];
        this.showLayer = false;
        return;
      }
      const _this = this;
      const { data } = await get('agent/goods/recommend');
      if (data.length > 0) {
        _this.list = data;
        _this.showLayer = true;
      }
    },
    setItem(item) {
      this.value = item.title;
      this.showLayer = false;
    },
    onChange(e) {
      this.value = e.detail;
      this.showLayer = false;
    },
    async onSearch() {
      console.log(this.value);
      if (!this.value) {
        return uni.showToast({
          icon: 'none',
          title: '请输入内容',
        });
      }
      const { data } = await get('agent/goods/intelligentCode', {
        goodsName: this.value,
      });
      if (data.length > 0) {
        this.rList = data;
      }
    },
    onRadioChange(e) {
      this.rValue = e.detail;
    },
    onSubmit() {
      this.show = true;
      if (!this.rValue) return;
      for (const item of this.rList) {
        if (item.code === this.rValue) {
          item.taxRate = item.taxRate.replace('%', '');
          this.modelItem = item;
          this.show = true;
        }
      }
    },
    async dialogConfirm() {
      const { code } = await post('agent/goods/save', {
        siteid: this.id,
        ...this.modelItem,
      });
      if (code === 0) {
        uni.showToast({
          title: '新增成功',
        });
        this.show = false;
        if (this.pageType === 'close') {
          return uni.navigateBack();
        }
        setTimeout(() => {
          uni.switchTab({
            url: 'Index',
          });
        }, 2000);
      }
    },
  },
};
</script>

<style lang="scss">
.page-bindshop {
  .search-box {
    position: relative;
    .layout-box {
      position: absolute;
      background: #1989fa;
      left: 0;
      top: 0;
      max-height: 400rpx;
      top: 109rpx;
      box-sizing: border-box;
      padding: 30rpx;
      width: 100%;
      font-size: 24rpx;
      .item {
        height: 80rpx;
        line-height: 80rpx;
        color: #fff;
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
  .van-radio__label {
    width: 100%;
  }
  .r-box {
    padding: 30rpx;
  }
  .box {
    display: flex;
    flex-direction: column;
    padding: 30rpx 0;
  }
  .ui-title {
    font-size: 28rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ui-text {
    font-size: 24rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba($color: #000000, $alpha: 0.5);
  }
  .dialog-box {
    box-sizing: border-box;
    padding: 30rpx;
  }
  .van-field__label--disabled {
    color: #646566;
  }
  .van-field__control--disabled {
    color: #323233;
  }
}
</style>
