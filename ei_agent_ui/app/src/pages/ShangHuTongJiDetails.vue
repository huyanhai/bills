<template>
  <view class="page-jihuo">
    <view class="search" @click="show = true">
      <van-search
        :value="search"
        label="搜索"
        placeholder="请选择时间"
        disabled
        @change="changeVal"
        @search="changeSearch"
      ></van-search>
    </view>
    <view class="box">
      <template v-if="pageData.length > 0">
        <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
          <view class="infos">
            <view class="item">
              <view class="col-l">发票类型</view>
              <view class="col-r">{{ invoiceType[item.invoiceType] }}</view>
            </view>
            <view class="item">
              <view class="col-l">开票金额</view>
              <view class="col-r">{{ item.money || '0' }}元</view>
            </view>
            <view class="item">
              <view class="col-l">开票数量</view>
              <view class="col-r">{{ item.number }}张</view>
            </view>
            <view class="item">
              <view class="col-l">开票时间</view>
              <view class="col-r">{{ item.outInvoiceTime || '' }}</view>
            </view>
          </view>
        </Card>
      </template>
      <van-empty description="暂无数据" v-else />
      <van-popup :show="show" position="bottom" bind:close="onClose">
        <van-datetime-picker
          :value="currentDate"
          type="date"
          title="选择月日"
          @confirm="confirm"
          @cancel="show = false"
        />
      </van-popup>
    </view>
  </view>
</template>

<script>
import Tabs from '../components/Tabs.vue';
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';
import dayjs from 'dayjs';
export default {
  components: {
    Tabs,
    Card,
  },
  data() {
    return {
      show: false,
      page: 1,
      limit: 100,
      pageData: {},
      invoiceType: {
        4: '增值税专用发票（纸票）',
        7: '增值税普通发票（纸票）',
        26: '增值税普通电子发票',
        28: '增值税专用电子发票',
      },
      rule: {
        1: '合伙人',
        2: '服务商',
        3: '区域合伙人',
        4: '城市合伙人',
      },
      type: 1,
      url: 'agent/site_day_invoice/page',
      search: '',
      siteId: '',
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date().getTime(),
    };
  },
  onLoad(e) {
    this.siteId = e.siteId;
    this.type = Number(e.type || 1);
    if (this.type === 2) {
      uni.setNavigationBarTitle({ title: '重庆票盟云科技有限公司日冲红统计' });
    }
  },
  onShow() {
    this.getData();
  },
  methods: {
    // formatter(type, value) {
    //   if (type === 'year') {
    //     return `${value}年`;
    //   }
    //   if (type === 'month') {
    //     return `${value}月`;
    //   }
    //   console.log('----');
    //   return value;
    // },
    confirm(e) {
      this.search = dayjs(new Date(e.detail)).format('YYYY-MM-DD');
      this.show = false;
      this.getData();
    },
    changeSearch(e) {
      this.page = 1;
      this.getData();
    },
    changeVal(e) {
      this.search = e.detail;
    },
    openShop() {},
    async getData() {
      let url = 'agent/site_day_invoice/page';
      if (this.type === 2) {
        url = 'agent/site_day_red_invoice/page';
      }
      const { data } = await post(url, {
        page: this.page,
        limit: this.limit,
        searchModel: {
          siteId: this.siteId,
          time: this.search,
        },
      });
      this.pageData = data;
    },
  },
};
</script>

<style lang="scss">
.page-jihuo {
  background: #eee;
  min-height: 100vh;
  .box {
    padding: 30rpx;
  }
  .m-card {
    display: block;
    margin-bottom: 30rpx;
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
  .m-button {
    margin-top: 60rpx;
    display: block;
    button {
      width: 100%;
    }
  }
}
</style>
