<template>
  <view class="page-jihuo">
    <Tabs :titleList="titleList" @itemChange="itemChange">
      <template v-if="pageData.length > 0">
        <template>
          <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
            <view class="infos" @click="goPath(item)">
              <view class="item">
                <view class="col-l">状态</view>
                <view class="col-r blue">{{ state[item.state] }}</view>
              </view>
              <view class="item">
                <view class="col-l">{{ item.buyerType === 2 ? '姓名' : '购方抬头' }}</view>
                <view class="col-r">{{ item.buyerTitle }}</view>
              </view>
              <view class="item">
                <view class="col-l">提交时间</view>
                <view class="col-r">{{ item.createTime }}</view>
              </view>
              <view class="item" v-if="types > 0">
                <view class="col-l">开票金额</view>
                <view class="col-r" v-if="types === '4'">
                  {{ item.redInvoiceTotalPriceTax || '0.00' }}
                </view>
                <view class="col-r" v-else>￥{{ item.invoiceTotalPriceTax || '0.00' }}</view>
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
          name: '蓝票',
          value: 1,
        },
        {
          name: '红票',
          value: 2,
        },
      ],
      page: 1,
      limit: 100,
      pageData: {},
      typeValue: {
        name: '蓝票',
        value: 1,
      },
      state: {
        0: '待确认',
        1: '已确认',
        2: '开票成功',
        3: '已作废',
        4: '已冲红',
        5: '取消开票',
        6: '验签中',
        7: '红票验签中',
      },
    };
  },
  onShow() {
    this.getData('agent/err_invoice_info/page');
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
      let url = 'agent/err_invoice_info/page';
      if (e.value === 2) {
        url = 'agent/red/err_invoice_info/page';
      }
      this.typeValue = e;
      this.getData(url);
    },
    goPath(item) {
      const url = this.typeValue.value === 1 ? `Billed?id=${item.id}` : `Red?id=${item.id}`;
      uni.navigateTo({
        url: url,
      });
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
      .type {
        font-size: 24rpx;
        color: rgb(202, 70, 70);
        font-weight: bold;
      }
      .blue {
        color: blue;
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
