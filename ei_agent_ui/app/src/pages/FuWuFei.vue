<template>
  <view class="page-jihuo">
    <template v-if="pageData.length > 0">
      <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
        <view class="infos">
          <view class="item">
            <view class="col-l">扣费状态 </view>
            <view class="col-r">{{ status[item.status] }}</view>
          </view>
          <view class="item">
            <view class="col-l">商户名称</view>
            <view class="col-r">{{ item.siteName }}</view>
          </view>
          <view class="item">
            <view class="col-l">金额</view>
            <view class="col-r">{{ item.money }}元</view>
          </view>
          <view class="item">
            <view class="col-l">服务时间</view>
            <view class="col-r">{{ item.serviceTime }}</view>
          </view>
        </view>
      </Card>
    </template>
    <van-empty description="暂无数据" v-else />
  </view>
</template>

<script>
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';
export default {
  components: {
    Card,
  },
  data() {
    return {
      id: -1,
      page: 1,
      limit: 100,
      pageData: {},
      status: {
        1: '未扣费',
        2: '已扣费',
      },
    };
  },
  onLoad(e) {
    this.id = e.id;
  },
  onShow() {
    this.getData();
  },
  methods: {
    async getData() {
      const { data } = await post('agent/site_info/server_fee/page', {
        page: this.page,
        limit: this.limit,
        searchModel: {
          siteId: this.id,
        },
      });
      this.pageData = data;
    },
  },
};
</script>

<style lang="scss">
.page-jihuo {
  min-height: 100vh;
  padding: 30rpx;
  background: #eee;
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
