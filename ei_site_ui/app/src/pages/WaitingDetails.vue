<template>
  <view class="page-waiting">
    <Card title="购方抬头">
      <view class="infos">
        <view class="item">
          <view class="col-l" v-if="invoice.buyerType === 1">公司名称</view>
          <view class="col-l" v-else>姓名</view>
          <view class="col-r">{{ invoice.buyerType === 1 ? invoice.buyerTitle : invoice.agentName || "" }}</view>
        </view>
        <view class="item" v-if="invoice.buyerType === 1">
          <view class="col-l">公司税号</view>
          <view class="col-r">{{ invoice.buyerTaxNo || "" }}</view>
        </view>
        <!-- <view class="item">
          <view class="col-l">发票类型</view>
          <view class="col-r" :class="{ red: invoice.invoiceTypeCode === 28 }">{{ invoiceTypeCode[invoice.invoiceTypeCode] || "" }}</view>
        </view> -->
        <!-- <view class="item">
          <view class="col-l">开票类型</view>
          <view class="col-r" style="color:red">{{ buyerInvoiceType[invoice.buyerInvoiceType] }}</view>
        </view> -->
        <view class="item">
          <view class="col-l">用户提交金额</view>
          <view class="col-r" style="color:red">{{ invoice.money }}元</view>
        </view>
        <!-- <view class="item">
          <view class="col-l">购方类型</view>
          <view class="col-r">{{ buyerType[invoice.buyerType] || "" }}</view>
        </view> -->
        <view class="item">
          <view class="col-l">邮箱</view>
          <view class="col-r">{{ invoice.buyerEmail }}</view>
        </view>
        <view class="item">
          <view class="col-l">电话</view>
          <view class="col-r">{{ invoice.buyerPhone }}</view>
        </view>
        <view class="item">
          <view class="col-l">申请时间</view>
          <view class="col-r">{{ invoice.createTime }}</view>
        </view>
        <view class="item">
          <view class="col-l">备注</view>
          <view class="col-r">{{ invoice.remarks || "" }}</view>
        </view>
      </view>
    </Card>
    <Card class="m-input">
      <view class="infos">
        <view class="item">
          <view class="col-l" @click="show1 = true">
            <CInput label="类型" titlew="100rpx" :value.sync="form.invoiceTypeName" placeholder="请选择类型" :disabled="true" :required="true">
              <van-icon name="arrow" />
            </CInput>
          </view>
        </view>
        <view class="item">
          <view class="col-l" @click="show = true">
            <CInput label="商品" titlew="100rpx" :value.sync="form.goods_name" placeholder="请选择商品" :disabled="true" :required="true">
              <van-icon name="arrow" />
            </CInput>
          </view>
        </view>
        <view class="item">
          <view class="col-l">
            <CInput label="单价" titlew="100rpx" :value.sync="form.price" :type="number" placeholder="请输入价格" :required="true"> </CInput>
          </view>
        </view>
        <view class="item">
          <view class="col-l l">
            <span>数量</span>
            <van-stepper :value="form.number" @change="onChange" :required="true" />
          </view>
        </view>
        <view class="item">
          <view class="col-l">
            <CInput label="单位" titlew="100rpx" :value.sync="form.unit" :type="text" placeholder="请输入单位"> </CInput>
          </view>
        </view>
      </view>
    </Card>
    <view class="price">开票总额{{ form.price * form.number }}</view>
    <van-button type="info" class="ui-button" @click="onSubmit">
      开票
    </van-button>
    <van-button type="warning" class="ui-button" @click="cancel">
      取消开票
    </van-button>
    <!-- <van-submit-bar :price="3050" button-text="开票" @submit="onSubmit" /> -->
    <van-popup :show="show" position="bottom" :close-on-click-overlay="false">
      <van-picker :columns="goodsList" @confirm="confirmItem" @cancel="show = false" show-toolbar value-key="goods_name" />
    </van-popup>
    <van-popup :show="show1" position="bottom" :close-on-click-overlay="false">
      <van-picker :columns="goodsList1" @confirm="confirmItem1" @cancel="show1 = false" show-toolbar value-key="invoiceTypeName" />
    </van-popup>
  </view>
</template>

<script>
import Card from "../components/Card.vue";
import CInput from "../components/CInput.vue";
import { get, post } from "../../libs/request";
export default {
  data() {
    return {
      id: "",
      goodsList: [],
      invoice: {},
      show: false,
      form: {
        invoiceTypeCode: "",
        invoiceTypeName: "",
        goods_name: "",
        goodsId: "",
        price: "",
        number: "1",
        unit: "",
      },
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
      buyerInvoiceType: {
        1: "专票",
        2: "普票",
      },
      show1: false,
      goodsList1: [],
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
      this.getInvoice();
    }
    this.getGoods();
    this.getGoods1();
  },
  methods: {
    async getGoods1() {
      const { data } = await get("site/query/site/invoice_type", {
        invoiceId: this.id,
      });
      if (data) {
        this.goodsList1 = data;
        this.form.invoiceTypeName = data[0].invoiceTypeName;
        this.form.invoiceTypeCode = data[0].invoiceTypeCode;
      }
    },

    onChange(e) {
      this.form.number = e?.detail;
    },
    async getInvoice() {
      const { data } = await get("site/get/invoice_info", {
        id: this.id,
      });
      if (data) {
        this.invoice = data;
        this.form.price = data.money || 0;
      }
    },
    async getGoods() {
      const { data } = await get("site/get/goodsinfo");
      if (data) {
        this.goodsList = data;
        this.form.goods_name = this.goodsList[0].goods_name;
        this.form.goodsId = this.goodsList[0].id;
      }
    },
    confirmItem(e) {
      this.form.goodsId = e?.detail?.value?.id;
      this.form.goods_name = e?.detail?.value?.goods_name;
      this.show = false;
    },
    confirmItem1(e) {
      this.form.invoiceTypeCode = e?.detail?.value?.invoiceTypeCode;
      this.form.invoiceTypeName = e?.detail?.value?.invoiceTypeName;
      this.show1 = false;
    },
    cancel() {
      const vm = this;
      uni.showModal({
        title: "",
        content: "确定取消开票？",
        confirmText: "确定",
        success: function(res) {
          if (res.confirm) {
            vm.cancelApi();
          }
        },
      });
    },
    async cancelApi() {
      const { code } = await get("site/cancel/invoice", {
        invioiceId: this.id,
      });
      if (code === 0) {
        uni.showToast({
          title: "取消开票成功！",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 3000);
      }
    },
    async onSubmit() {
      if (this.form.invoiceTypeCode === 4 || this.form.invoiceTypeCode === 7) {
        return uni.showModal({
          content: "纸票请到Pc端开具",
          showCancel: false,
          confirmText: "好的",
          success: function(res) {},
        });
      }
      const { code } = await post("site/get/invoice", {
        ...this.form,
        invoiceId: this.id,
      });
      if (code === 0) {
        uni.showModal({
          title: "开票",
          content: "开票成功，已发送到客户邮箱",
          showCancel: false,
          confirmText: "点我返回",
          success: function(res) {
            if (res.confirm) {
              uni.navigateBack({
                delta: 1,
              });
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.page-waiting {
  min-height: 100vh;
  background: #eee;
  box-sizing: border-box;
  padding: 30rpx;
  .infos {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      line-height: 60rpx;
      .col-l {
        color: rgba($color: #000000, $alpha: 0.7);
        &.l {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgb(235, 237, 240, 0.5);
        }
      }
      .col-r {
        &.red {
          color: red;
        }
      }
    }
  }

  .m-card {
    margin-bottom: 30rpx;
  }
  .m-input {
    .col-l {
      width: 100%;
    }
  }
  .ui-button {
    width: 100%;
    margin-bottom: 30rpx;
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
  .price {
    margin-bottom: 24rpx;
    font-size: 24rpx;
    color: red;
  }
}
</style>
