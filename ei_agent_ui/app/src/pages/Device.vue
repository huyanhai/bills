<template>
  <view class="device">
    <van-button type="info" @click="goShopInfos('FenPei', id)" v-if="data.onlineStatus === '1'">
      发票分配
    </van-button>
    <van-button type="info" @click="tongbu(id)">
      同步税控
    </van-button>
    <Card>
      <view class="infos">
        <view class="item">
          <view class="col-l">设备状态</view>
          <view class="col-r">{{ data.onlineStatus === '1' ? '在线' : '离线' }}</view>
        </view>
      </view>
    </Card>
    <Card title="设备监管数据" v-for="item in data.monitoringData" :key="item.id">
      <view class="infos">
        <view class="item">
          <view class="col-l">发票类型:</view>
          <view class="col-r">{{ invoiceTypeCode[item.invoiceTypeCode] || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">开票截止时间：</view>
          <view class="col-r">{{ item.billingDeadline || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">单张发票开票金额限额：</view>
          <view class="col-r">{{ item.singleInvoiceMaxAmount || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">正数票累计金额限额：</view>
          <view class="col-r">{{ item.totalBlueInvoiceMaxAmount || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">负数票累计金额限额：</view>
          <view class="col-r">{{ item.totalRedInvoiceMaxAmount || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">最新报税日期：</view>
          <view class="col-r">{{ item.latestTaxDeclarationTime || '' }}</view>
        </view>
      </view>
    </Card>
  </view>
</template>

<script>
import Card from '../components/Card.vue';
import { get } from '../../libs/request';

export default {
  data() {
    return {
      data: {},
      invoiceTypeCode: {
        4: '增值税专用发票',
        7: '增值税普通发票',
        26: '增值税普通电子发票',
        28: '增值税专用电子发票',
      },
    };
  },
  components: {
    Card,
  },
  onLoad(e) {
    this.id = e?.id;
    if (this.id) {
      this.getData();
    }
  },
  methods: {
    goShopInfos(type, id) {
      uni.navigateTo({
        url: `${type}?id=${id}`,
      });
    },
    async tongbu(id) {
      const { code } = await get(
        'agent/synchronous/device',
        {
          siteId: id,
        },
        '同步中',
      );
      if (code === 0) {
        uni.showToast({
          title: '同步成功',
        });
      }
    },
    async getData() {
      const { data } = await get('agent/site/tax/disc', {
        siteId: this.id,
      });
      if (data) {
        this.data = data;
      }
    },
  },
};
</script>

<style lang="scss">
.device {
  min-height: 100vh;
  background: #eee;
  box-sizing: border-box;
  padding: 30rpx;
  button {
    width: 100%;
    margin-bottom: 20rpx;
  }
  .m-card {
    margin-bottom: 30rpx;
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
}
</style>
