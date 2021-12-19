<template>
  <view class="page-zhanghu">
    <van-button type="info" class="ui-btn" @click="add">添加对公账户</van-button>
    <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
      <view class="infos">
        <view class="item">
          <view class="col-l">合伙人名称</view>
          <view class="col-r">{{ item.agentName }}</view>
        </view>
        <view class="item">
          <view class="col-l">银行卡号</view>
          <view class="col-r">{{ item.cardNumber }}</view>
        </view>
        <view class="item">
          <view class="col-l">开户行</view>
          <view class="col-r">{{ item.bankAddress }}</view>
        </view>
        <view class="item">
          <view class="col-l">收款人</view>
          <view class="col-r">{{ item.payee }}</view>
        </view>
        <view class="item">
          <view class="col-l">电话</view>
          <view class="col-r">{{ item.phone }}</view>
        </view>
        <view class="item">
          <view class="col-l">状态</view>
          <view class="col-r">{{ state[item.state] }}</view>
        </view>
      </view>
    </Card>
  </view>
</template>

<script>
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';

export default {
  data() {
    return {
      page: 1,
      limit: 100,
      pageData: {},
      state: {
        0: '审核中',
        1: '驳回',
        2: '审核成功',
      },
    };
  },
  components: {
    Card,
  },
  onShow() {
    this.getPageData();
  },
  methods: {
    add() {
      uni.navigateTo({
        url: 'SetAccount',
      });
    },
    async getPageData() {
      const { data, code } = await post('agent/bank/info/page', {
        page: this.page,
        limit: this.limit,
        searchModel: {
          id: '',
        },
      });
      if (code === 0) {
        this.pageData = data;
      }
    },
  },
};
</script>

<style lang="scss">
.page-zhanghu {
  min-height: 100vh;
  padding: 30rpx;
  background: #eee;
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
  .ui-btn {
    width: 100%;
    display: block;
    padding: 30rpx 0rpx;
    box-sizing: border-box;
    margin-bottom: 30rpx;
    .van-button {
      width: 100%;
    }
  }
}
</style>
