<template>
  <view class="mycode">
    <view class="box">
      <Card title="发票信息" :titleRight="state[pageData.state]">
        <view class="infos">
          <view class="item">
            <view class="col-l">商户抬头</view>
            <view class="col-r">{{ pageData.sellerTitle }}</view>
          </view>
          <view class="item">
            <view class="col-l">购方抬头</view>
            <view class="col-r">{{ pageData.buyerTitle }}</view>
          </view>
          <view class="item">
            <view class="col-l">公司税号</view>
            <view class="col-r">{{ pageData.buyerTaxNo }}</view>
          </view>
          <view class="item">
            <view class="col-l">开户行</view>
            <view class="col-r">{{ pageData.buyerBank }}</view>
          </view>
          <view class="item">
            <view class="col-l">银行账号</view>
            <view class="col-r">{{ pageData.buyerAccount }}</view>
          </view>
          <view class="item">
            <view class="col-l">地 址</view>
            <view class="col-r">{{ pageData.buyerAddress }}</view>
          </view>
          <view class="item">
            <view class="col-l">电 话</view>
            <view class="col-r">{{ pageData.buyerPhone }}</view>
          </view>
          <view class="item">
            <view class="col-l">邮 箱</view>
            <view class="col-r">{{ pageData.buyerEmail }}</view>
          </view>
          <view class="item">
            <view class="col-l">申请时间</view>
            <view class="col-r">{{ pageData.createTime }}</view>
          </view>
          <!-- <view class="item">
            <view class="col-l">开票描述</view>
            <view class="col-r">{{ pageData.description }}</view>
          </view> -->
        </view>
      </Card>
    </view>
  </view>
</template>

<script>
import Card from "../components/Card.vue";
import { get, post } from "../../libs/request";

export default {
  data() {
    return {
      pageData: {},
      state: {
        0: "待确认",
        1: "已确认",
        2: "开票成功",
        3: "已作废",
        4: "已冲红",
        5: "取消开票",
        6: "验签中",
        7: "红票验签中",
      },
      id: "",
    };
  },
  components: {
    Card,
  },
  onLoad(e) {
    this.id = e.id;
  },
  onShow() {
    this.getData();
  },
  methods: {
    async getData() {
      const { data } = await get("user/get/invoice_info", {
        id: this.id,
      });
      this.pageData = data;
    },
    downLoad(url) {
      uni.setClipboardData({
        data: url,
        success() {
          uni.showModal({
            content: "复制成功，到浏览器打开下载",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
              }
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
.mycode {
  min-height: 100vh;
  background: #eee;
  display: flex;
  flex-direction: column;
  .m-button {
    margin-bottom: 30rpx;
    display: block;
    button {
      width: 100%;
    }
  }
  .box {
    padding: 30rpx;
    flex: 1 0 auto;
    height: 50vh;
    width: 100%;
    box-sizing: border-box;
    .m-card {
      margin-bottom: 30rpx;
    }
    .infos {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24rpx;
        line-height: 60rpx;
        .red {
          color: red;
        }
        .col-l {
          color: rgba($color: #000000, $alpha: 0.7);
          &.l {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgb(235, 237, 240, 0.5);
          }
        }
      }
    }
  }
}
</style>
