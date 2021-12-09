<template>
  <view class="page-jihuo">
    <Tabs :titleList="titleList" @itemChange="itemChange">
      <template v-if="pageData.length > 0">
        <template v-if="typeValue.value === 1">
          <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
            <view class="infos">
              <view class="item">
                <view class="col-l">状态</view>
                <view class="col-r" style="color:red">{{ status[item.status] }}</view>
              </view>
              <view class="item">
                <view class="col-l"> 商户名称</view>
                <view class="col-r">{{ item.siteName }}</view>
              </view>
              <view class="item">
                <view class="col-l">奖励金额</view>
                <view class="col-r">{{ item.money || '0' }}元</view>
              </view>
              <view class="item">
                <view class="col-l">开票量</view>
                <view class="col-r">{{ item.number || '' }}</view>
              </view>
              <view class="item">
                <view class="col-l">时间</view>
                <view class="col-r">{{ item.createTime }}</view>
              </view>
            </view>
          </Card>
        </template>
        <template v-else>
          <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
            <view class="infos">
              <view class="item">
                <view class="col-l">状态</view>
                <view class="col-r" style="color:red">{{ status[item.status] }}</view>
              </view>
              <view class="item">
                <view class="col-l">净增数</view>
                <view class="col-r">{{ item.number - item.basis }}</view>
              </view>
              <view class="item">
                <view class="col-l">奖励金额</view>
                <view class="col-r">{{ item.money }}</view>
              </view>
              <view class="item">
                <view class="col-l">时间</view>
                <view class="col-r">{{ item.createTime }}</view>
              </view>
            </view>
          </Card>
        </template>
      </template>
      <van-empty description="暂无数据" v-else />
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
          name: '开户奖励',
          value: 1,
        },
        {
          name: '净增奖励',
          value: 2,
        },
      ],
      page: 1,
      limit: 100,
      pageData: {},
      status: {
        1: '未结算',
        2: '已结算',
      },
      rule: {
        1: '合伙人',
        2: '服务商',
        3: '区域合伙人',
        4: '城市合伙人',
      },
      typeValue: {
        name: '开户奖励',
        value: 1,
      },
    };
  },
  onShow() {
    this.getData('agent/site_qualified_profit/page');
  },
  methods: {
    openShop() {},
    async getData(url) {
      const { data } = await post(url, {
        page: this.page,
        limit: this.limit,
        searchModel: {
          id: '',
        },
      });
      this.pageData = data;
    },
    itemChange(e) {
      let url = 'agent/site_qualified_profit/page';
      if (e.value === 2) {
        url = 'agent/site_net_rewards/page';
      }
      this.typeValue = e;
      this.getData(url);
    },
  },
};
</script>

<style lang="scss">
.page-jihuo {
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
