<template>
  <view class="page-fenpei">
    <div class="search-box">
      <view class="input" @click="show = true">
        <CInput :value.sync="invoiceTypeText" placeholder="请选择类型" :disabled="true">
          <van-icon name="arrow-down" />
        </CInput>
      </view>
      <van-button type="info" size="small" class="ui-btn" @click="getData">搜索</van-button>
    </div>
    <view class="list-box">
      <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
        <view class="infos">
          <view class="item">
            <view class="col-l">发票 类 型</view>
            <view class="col-r">{{ invoiceTypeCode1[item.invoiceTypeCode] }} </view>
          </view>
          <view class="item">
            <view class="col-l">发票代码</view>
            <view class="col-r">{{ item.invoiceCode }}</view>
          </view>
          <view class="item">
            <view class="col-l">发票起始号码</view>
            <view class="col-r">{{ item.invoiceStartNo }}</view>
          </view>
          <view class="item">
            <view class="col-l">发票结束号码</view>
            <view class="col-r">{{ item.invoiceEndNo }}</view>
          </view>
          <view class="item">
            <view class="col-l">数量</view>
            <view class="col-r">{{ item.purchaseSize }}</view>
          </view>
        </view>
        <van-button class="m-button" type="info" @click="fenpei(item)">
          分配发票
        </van-button>
      </Card>
    </view>
    <van-popup :show="show" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="[
          { name: '增值税普通电子发票', id: 26 },
          { name: '增值税专用电子发票', id: 28 },
        ]"
        @confirm="confirmItem"
        @cancel="show = false"
        show-toolbar
        value-key="name"
      />
    </van-popup>
    <van-dialog
      use-slot
      :show="show1"
      show-cancel-button
      @confirm="dialogConfirm"
      :overlay="true"
      @cancel="show1 = false"
      title="发票分配"
    >
      <view class="dialog-box">
        <CInput
          type="number"
          :value.sync="purchaseSize"
          placeholder="请输入数量"
          label="数量"
          use-button-slot
        />
      </view>
    </van-dialog>
  </view>
</template>

<script>
import CInput from '../components/CInput.vue';
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';
export default {
  data() {
    return {
      id: null,
      pageData: [],
      invoiceTypeCode: '',
      invoiceTypeText: '',
      show: false,
      show1: false,
      activeItem: {},
      purchaseSize: 0,
      invoiceTypeCode1: {
        '4': '增值税专用发票',
        '7': '增值税普通发票',
        '26': '增值税普通电子发票',
        '28': '增值税专用电子发票',
      },
    };
  },
  onLoad(e) {
    const { id } = e;
    this.id = id;
  },
  components: {
    Card,
    CInput,
  },
  methods: {
    async getData() {
      if (!this.invoiceTypeCode) return;
      const { data, code } = await get('agent/invoice/apply_record', {
        invoiceTypeCode: this.invoiceTypeCode,
        siteId: this.id,
      });
      if (code === 0) {
        this.pageData = data.list;
      }
    },
    confirmItem(e) {
      this.invoiceTypeCode = e.detail.value.id;
      this.invoiceTypeText = e.detail.value.name;
      this.show = false;
    },
    fenpei(item) {
      this.activeItem = item;
      this.show1 = true;
    },
    async dialogConfirm() {
      this.show1 = false;
      if (this.purchaseSize < 1) {
        return uni.showToast({
          icon: 'none',
          title: `数量不能小于1`,
        });
      }
      if (this.purchaseSize > this.activeItem.purchaseSize) {
        return uni.showToast({
          icon: 'none',
          title: `数量不能大于${this.activeItem.purchaseSize}`,
        });
      }

      const { code } = await post('agent/invoice/allot', {
        ...this.activeItem,
        siteId: this.id,
        purchaseSize: Number(this.purchaseSize),
      });
      if (code === 0) {
        uni.showToast({
          title: '分配成功',
        });
      }
    },
  },
};
</script>

<style lang="scss">
.page-fenpei {
  min-height: 100vh;
  background: #eee;
  .search-box {
    display: flex;
    align-items: center;
    background: #fff;
    box-sizing: border-box;
    padding: 0 30rpx;
    .input {
      width: 50%;
      flex: 1;
      .van-cell:after {
        display: none;
      }
      .van-field__body {
        background: #f7f7f7;
        border-radius: 10rpx;
        box-sizing: border-box;
        font-size: 28rpx;
        border: none;
        padding: 10rpx 20rpx;
      }
    }
    button {
      background: none;
      color: #000000;
      border: none;
      &::before,
      &::after {
        display: none;
      }
    }
  }
  .list-box {
    padding: 30rpx;
    .m-card {
      display: block;
      margin-bottom: 30rpx;
    }
  }
  .infos {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      line-height: 80rpx;
      .col-l {
        color: rgba($color: #000000, $alpha: 0.7);
      }
      .col-r {
        &.red {
          color: red;
        }
        &.blue {
          color: blue;
        }
      }
      .red {
        color: red;
      }
      .l {
        .uploads {
          width: 180rpx;
          height: 180rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
      &.last-item {
        justify-content: flex-start;
        .l {
          margin-right: 30rpx;
          text-align: center;
        }
      }
    }
  }
  .van-field__label--disabled {
    color: #646566;
  }
  .van-field__control--disabled {
    color: #323233;
  }
  .dialog-box {
    box-sizing: border-box;
    padding: 30rpx;
  }
  .m-button {
    display: block;
    padding-bottom: 30rpx;
    button {
      width: 100%;
    }
  }
}
</style>
