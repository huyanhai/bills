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
          <view class="col-r" style="color:red">{{ state[item.state] }}</view>
        </view>
        <view class="item">
          <view class="col-l">金额</view>
          <view class="col-r">￥{{ item.money }}元</view>
        </view>
        <view class="item">
          <view class="col-l">实际金额</view>
          <view class="col-r">{{ item.remitMoney }}</view>
        </view>
        <view class="item">
          <view class="col-l">银行名称</view>
          <view class="col-r">{{ item.bank }}</view>
        </view>
        <view class="item">
          <view class="col-l">是否提供发票</view>
          <view class="col-r">{{ item.invoice === 2 ? '否' : '是' }}</view>
        </view>
        <view class="item">
          <view class="col-l">收款人</view>
          <view class="col-r">{{ item.name || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">联系电话</view>
          <view class="col-r">{{ item.phone || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">描述</view>
          <view class="col-r">{{ item.remark || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">提现时间</view>
          <view class="col-r">{{ item.profitsTime }}</view>
        </view>
      </view>
    </Card>
  </view>
</template>

<script>
import Card from '../components/Card.vue';
import { post } from '../../libs/request';

export default {
  data() {
    return {
      pageData: [],
      page: 1,
      limit: 100,
      state: {
        '-1': '审核失败',
        0: '审核中',
        1: '打款中',
        2: '打款失败',
        3: '已到账',
      },
      userType: {
        1: '合伙人',
        2: '高级合伙人',
        3: '区域合伙人',
        4: '城市合伙人',
      },
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
      const { data, code } = await post('agent/withdrawal/record/page', {
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
