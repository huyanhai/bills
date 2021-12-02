<template>
  <view class="page-jihuo">
    <Tabs :titleList="titleList" @itemChange="itemChange">
      <template v-if="pageData.length > 0">
        <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
          <view class="infos">
            <view class="item">
              <view class="col-l">状态</view>
              <view class="col-r" :class="{ red: typeValue.value === 1 }">{{
                typeValue.name
              }}</view>
            </view>
            <view class="item">
              <view class="col-l">收益</view>
              <view class="col-r">{{ item.money }}元</view>
            </view>
            <view class="item">
              <view class="col-l">交易时间</view>
              <view class="col-r">{{ item.estimateDate }}</view>
            </view>
          </view>
        </Card>
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
          name: '未结算',
          value: 1,
        },
        {
          name: '已结算',
          value: 2,
        },
      ],
      page: 1,
      limit: 100,
      pageData: {},
      typeValue: {
        name: '待结算',
        value: 1,
      },
    };
  },
  onShow() {
    this.getData('agent/agent_estimate/page');
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
      let url = 'agent/agent_estimate/page';
      if (e.value === 2) {
        url = 'agent/agent_estimate_ok/page';
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
      .col-r {
        &.red {
          color: red;
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
  .m-button {
    margin-top: 60rpx;
    display: block;
    button {
      width: 100%;
    }
  }
}
</style>
