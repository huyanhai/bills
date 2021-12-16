<template>
  <view class="page-jihuo">
    <Tabs :titleList="titleList" @itemChange="itemChange" :noPadding="true">
      <view class="search">
        <van-search
          :value="search"
          label="搜索"
          placeholder="公司名称/商户名称"
          use-action-slot
          @change="changeVal"
          @search="changeSearch"
        >
          <view slot="action" @click="getData">搜索</view>
        </van-search>
      </view>
      <view class="box">
        <template v-if="pageData.length > 0">
          <template v-if="typeValue.value === 1">
            <Card :paddingTop="false" v-for="item in pageData" :key="item.siteId">
              <view class="infos rows">
                <view class="foot">{{ item.siteName }}</view>
                <view class="item">
                  <view class="col-l">本月开票{{ item.number }}</view>
                </view>
                <view class="item">
                  <view class="col-l">本月开票金额{{ item.money }}</view>
                </view>
                <view class="item">
                  <view class="col-l">本月冲红{{ item.redNumber }}</view>
                </view>
                <view class="item">
                  <view class="col-l">本月冲红金额{{ item.redMoney }}</view>
                </view>
                <view class="foot">
                  <van-button type="info" size="small" @click="tongji(item.siteId, 1)">
                    开票统计
                  </van-button>
                  <van-button type="info" size="small" @click="tongji(item.siteId, 2)">
                    冲红统计
                  </van-button>
                </view>
              </view>
            </Card>
          </template>
          <template v-else>
            <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
              <view class="infos">
                <view class="item">
                  <view class="col-l">商户数</view>
                  <view class="col-r">{{ item.number }}</view>
                </view>
                <view class="item">
                  <view class="col-l">时间</view>
                  <view class="col-r">{{ item.time }}</view>
                </view>
              </view>
            </Card>
          </template>
        </template>
        <van-empty description="暂无数据" v-else />
      </view>
    </Tabs>
  </view>
</template>

<script>
import Tabs from '../components/Tabs.vue';
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';

export default {
  components: {
    Tabs,
    Card,
  },
  data() {
    return {
      titleList: [
        {
          name: '商户开票统计',
          value: 1,
        },
        {
          name: '有效商户统计',
          value: 2,
        },
      ],
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
      typeValue: {
        name: '商户开票统计',
        value: 1,
      },
      url: 'agent/site_info/monthly/invoice/statistical/page',
      search: '',
    };
  },
  onShow() {
    this.url = 'agent/site_info/monthly/invoice/statistical/page';
    this.getData();
  },
  methods: {
    tongji(item, type) {
      uni.navigateTo({
        url: `ShangHuTongJiDetails?siteId=${item}&type=${type}`,
      });
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
      let searchModel = {};
      if (this.typeValue.value === 1) {
        searchModel = { company: this.search };
      } else {
        searchModel = { id: this.search };
      }
      const { data } = await post(this.url, {
        page: this.page,
        limit: this.limit,
        searchModel: searchModel,
      });
      this.pageData = data;
    },
    itemChange(e) {
      this.search = '';
      this.url = 'agent/site_info/monthly/invoice/statistical/page';
      if (e.value === 2) {
        this.url = 'agent/site_qualified_statistical/page';
      }
      this.typeValue = e;
      this.getData(this.url);
    },
  },
};
</script>

<style lang="scss">
.page-jihuo {
  .box {
    padding: 30rpx;
  }
  .m-card {
    display: block;
    margin-bottom: 30rpx;
  }
  .infos {
    &.rows {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 50%;
      }
      .foot {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin: 20rpx 0;
        font-size: 30rpx;
      }
    }
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
  .m-button {
    margin-top: 60rpx;
    display: block;
    button {
      width: 100%;
    }
  }
}
</style>
