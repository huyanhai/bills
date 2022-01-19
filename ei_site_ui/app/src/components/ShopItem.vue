<template>
  <view class="card-item" @click="$emit('itemClick')">
    <view class="item">
      <view class="col-l">状态</view>
      <view class="col-r">
        <view class="type" v-if="types === '0'">
          待确认
        </view>
        <view class="type" v-if="types === '1'">
          验签中
        </view>
        <view class="type blue" v-if="types === '2'">
          开票成功
        </view>
        <view class="type" v-if="types === '3'">
          已作废
        </view>
        <view class="type" v-if="types === '4'">
          已冲红
        </view>
        <view class="type" v-if="types === '5'">
          取消开票
        </view>
        <view class="type" v-if="types === '6'">
          开票中
        </view>
        <view class="type" v-if="types === '7'">
          冲红中
        </view>
      </view>
    </view>
    <view class="item">
      <view class="col-l">{{ item.buyerType === 2 ? "姓名" : "购方抬头" }}</view>
      <view class="col-r">{{ item.buyerTitle }}</view>
    </view>
    <!-- <view class="item">
      <view class="col-l">发票类型</view>
      <view class="col-r">{{ invoiceTypeCode[item.invoiceTypeCode] }}</view>
    </view>
    <view class="item">
      <view class="col-l">购方类型</view>
      <view class="col-r">{{ buyerType[item.buyerType] }}</view>
    </view> -->
    <view class="item">
      <view class="col-l">提交时间</view>
      <view class="col-r">{{ item.createTime }}</view>
    </view>
    <view class="item" v-if="types > 0">
      <view class="col-l">开票金额</view>
      <view class="col-r" v-if="types === '4'">{{ item.redInvoiceTotalPriceTax || "0.00" }}</view>
      <view class="col-r" v-else>￥{{ item.invoiceTotalPriceTax || "0.00" }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    types: {
      type: String,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      invoiceTypeCode: {
        4: "增值税专用发票（纸票）",
        7: "增值税普通发票（纸票）",
        26: "增值税普通电子发票",
        28: "增值税专用电子发票",
      },
      buyerType: {
        1: "企业",
        2: "个人",
      },
    };
  },
};
</script>

<style lang="scss">
.card-item {
  background: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  box-sizing: border-box;
  position: relative;
  .item {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    margin-bottom: 10rpx;
    .col-l {
      color: rgba($color: #000000, $alpha: 0.6);
    }
    .type {
      font-size: 24rpx;
      color: rgb(202, 70, 70);
      font-weight: bold;
      &.blue {
        color: blue;
      }
    }
  }
}
</style>
