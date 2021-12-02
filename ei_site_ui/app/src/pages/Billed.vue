<template>
  <view class="page-red">
    <Card title="购方抬头" :titleRight="titleRight">
      <view class="infos">
        <view class="item">
          <view class="col-l" v-if="data.buyerType === 1">公司名称</view>
          <view class="col-l" v-else>姓名</view>
          <view class="col-r">{{ data.buyerType === 1 ? data.buyerTitle : data.agentName || "" }}</view>
        </view>
        <view class="item" v-if="data.buyerType === 1">
          <view class="col-l">公司税号</view>
          <view class="col-r">{{ data.buyerTaxNo || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">邮箱</view>
          <view class="col-r">{{ data.buyerEmail || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">购方电话</view>
          <view class="col-r">{{ data.contactPhone || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">申请时间</view>
          <view class="col-r">{{ data.createTime || "" }}</view>
        </view>
      </view>
    </Card>
    <Card title="发票信息" v-if="data.state !== 5">
      <view class="infos">
        <view class="item">
          <view class="col-l">开票日期</view>
          <view class="col-r">{{ data.createTime || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">发票代号</view>
          <view class="col-r">{{ data.invoiceCode || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">发票编号</view>
          <view class="col-r">{{ data.invoiceCode || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">发票类型</view>
          <view class="col-r" :class="{ red: data.invoiceTypeCode === 28 }">{{ invoiceTypeCode[data.invoiceTypeCode] || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">购方类型</view>
          <view class="col-r">{{ buyerType[data.buyerType] || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">校验码</view>
          <view class="col-r">{{ data.checkCode || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">开票人</view>
          <view class="col-r">{{ data.drawer || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">复核人</view>
          <view class="col-r">{{ data.checker || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">收款人</view>
          <view class="col-r">{{ data.payee || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">价税金额</view>
          <view class="col-r">{{ data.invoiceTotalPriceTax || "" }}元</view>
        </view>
        <view class="item">
          <view class="col-l">商品金额</view>
          <view class="col-r">{{ data.invoiceTotalPrice || "" }}元</view>
        </view>
        <view class="item">
          <view class="col-l">税额</view>
          <view class="col-r">{{ data.invoiceTotalTax || "" }}元</view>
        </view>
        <!-- <view class="item">
          <view class="col-l">发票描述</view>
          <view class="col-r">{{ data.description || "" }}</view>
        </view> -->
      </view>
    </Card>
    <Card title="商品信息" v-if="data.state !== 5">
      <view class="infos">
        <view class="item">
          <view class="col-l">商品名称</view>
          <view class="col-r">{{ data.goodsName || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">单价</view>
          <view class="col-r">{{ data.price || "" }}元</view>
        </view>
        <view class="item">
          <view class="col-l">税率</view>
          <view class="col-r">{{ data.taxRate || "" }}</view>
        </view>
        <view class="item">
          <view class="col-l">数量</view>
          <view class="col-r">{{ data.number || "" }}</view>
        </view>
      </view>
    </Card>
  </view>
</template>

<script>
import CInput from "../components/CInput.vue";
import Card from "../components/Card.vue";
import { get } from "../../libs/request";

export default {
  data() {
    return {
      show: true,
      id: 0,
      data: {},
      invoiceTypeCode: {
        4: "增值税专用发票（纸票）",
        7: "增值税普通发票（纸票）",
        26: "普通电子发票",
        28: "专用电子发票",
      },
      buyerType: {
        1: "企业",
        2: "个人",
      },
      email: "",
    };
  },
  components: {
    Card,
    CInput,
  },
  onLoad(e) {
    const { id } = e;
    if (id) {
      this.id = id;
      this.getData();
    }
  },
  computed: {
    titleRight: function() {
      let state = "";
      switch (this.data.state) {
        case 0:
          state = "待确认";
          break;
        case 1:
          state = "已确认";
          break;
        case 2:
          state = "开票成功";
          break;
        case 3:
          state = "已作废";
          break;
        case 4:
          state = "已冲红";
          break;
        case 5:
          state = "取消开票";
          break;
        case 6:
          state = "验签中";
          break;
        case 7:
          state = "红票验签中";
          break;
        default:
          break;
      }
      return state;
    },
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    async getData() {
      const { data, code } = await get("site/get/invoice_info", {
        id: this.id,
      });
      if (code === 0 && data) {
        this.data = data;
        this.email = data.buyerEmail;
      }
    },
  },
};
</script>

<style lang="scss">
.page-red {
  min-height: 100vh;
  background: #eee;
  box-sizing: border-box;
  padding: 30rpx;
  .dialog-box {
    box-sizing: border-box;
    padding: 30rpx;
    text-align: left;
  }
  .infos {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      line-height: 60rpx;
      .col-l {
        color: rgba($color: #000000, $alpha: 0.7);
      }
      .col-r {
        &.red {
          color: red;
        }
      }
      .red {
        color: red;
      }
    }
  }
  .m-card {
    margin-bottom: 30rpx;
  }
  .beizhu {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
  }
  .ui-button1 {
    width: 100%;
    button {
      width: 100%;
      margin-top: 90rpx;
    }
  }
  .ui-button2 {
    width: 100%;
    button {
      width: 100%;
      margin-top: 30rpx;
      margin-bottom: 90rpx;
    }
  }
  .ui-button3 {
    width: 100%;
    button {
      width: 100%;
      margin: 90rpx 0;
    }
  }
}
</style>
