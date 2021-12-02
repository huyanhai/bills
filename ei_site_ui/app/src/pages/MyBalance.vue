<template>
  <view class="page-balance">
    <Card v-for="item in pageData" :key="item.id">
      <view class="infos">
        <view class="item">
          <view class="col-l">合伙人名称</view>
          <view class="col-r">{{ item.agentName }}</view>
        </view>
        <view class="item">
          <view class="col-l">状态</view>
          <view class="col-r">{{ item.status === 1 ? "收入" : "支出" }}</view>
        </view>
        <view class="item">
          <view class="col-l">金额</view>
          <view class="col-r">{{ item.money }}</view>
        </view>
        <view class="item">
          <view class="col-l">描述</view>
          <view class="col-r">{{ item.remark }}</view>
        </view>
        <view class="item">
          <view class="col-l">交易时间</view>
          <view class="col-r">{{ item.profitsTime }}</view>
        </view>
      </view>
    </Card>
  </view>
</template>

<script>
import Card from "../components/Card.vue";
import { post } from "../../libs/request";

export default {
  data() {
    return {
      pageData: [],
      page: 1,
      limit: 100,
    };
  },
  components: {
    Card,
  },
  onLoad() {
    this.getData();
  },
  methods: {
    async getData() {
      const { data, code } = await post("agent/balance/record/page", {
        page: this.page,
        limit: this.limit,
        searchModel: {
          id: "",
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
.page-balance {
  min-height: 100vh;
  background: #eee;
  box-sizing: border-box;
  padding: 30rpx;
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
}
</style>
