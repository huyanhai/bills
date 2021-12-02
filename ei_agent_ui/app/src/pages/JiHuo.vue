<template>
  <view class="page-jihuo">
    <Tabs :titleList="titleList" @itemChange="itemChange">
      <template>
        <template v-if="pageData.length > 0">
          <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
            <view class="infos">
              <view class="item">
                <view class="col-l">订单号</view>
                <view class="col-r">{{ item.id }}</view>
              </view>
              <view class="item">
                <view class="col-l">商户名称</view>
                <view class="col-r">{{ item.siteName }}</view>
              </view>
              <view class="item">
                <view class="col-l">续费时间</view>
                <view class="col-r">{{ item.menuTime }}年</view>
              </view>
              <view class="item">
                <view class="col-l">已支付金额</view>
                <view class="col-r">{{ item.money }}</view>
              </view>
              <view class="item">
                <view class="col-l">激活金额</view>
                <view class="col-r">{{ item.menuTime }}</view>
              </view>
              <view class="item">
                <view class="col-l">申请时间</view>
                <view class="col-r">{{ item.createTime }}</view>
              </view>
              <view class="item">
                <view class="col-l">状态</view>
                <view class="col-r red" v-if="item.status === 1">商户已支付</view>
                <view class="col-r blue" v-if="item.status === 2">合伙人已支付</view>
              </view>
            </view>
            <van-button class="m-button" type="info" @click="openShop(item.id)" v-if="type === 1">
              开户激活
            </van-button>
          </Card>
        </template>
        <van-empty description="暂无数据" v-else />
      </template>
    </Tabs>
  </view>
</template>

<script>
import Tabs from '../components/Tabs.vue';
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';
// import { userLogin } from "../../libs/auth";

export default {
  components: {
    Tabs,
    Card,
  },
  data() {
    return {
      titleList: [
        {
          name: '待激活',
          value: 1,
        },
        {
          name: '已激活',
          value: 2,
        },
      ],
      pageData: [],
      page: 1,
      limit: 100,
      type: 1,
    };
  },
  onShow() {
    this.getShopInfo(1);
  },
  methods: {
    async openShop(id) {
      if (!id) return;
      // const { code } = await userLogin();
      // console.log(code);
      // if (code !== 0) return
      const { data } = await get('agent/wxpay/prepay', {
        openAccountId: id,
      });
      const _this = this;
      if (data) {
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success() {
            _this.getStatus(data.orderNum);
          },
          fail(res) {
            uni.showToast({
              title: '支付失败',
              duration: 2000,
              icon: 'none',
            });
          },
        });
      }
    },
    async getStatus(orderNum) {
      if (!orderNum) return;
      const { code } = await get('agent/wxpay/status', {
        orderNum: orderNum,
      });
      if (code === 0) {
        uni.showToast({
          title: '激活成功',
          duration: 2000,
          icon: 'none',
        });
        this.getShopInfo(1);
      }
    },
    itemChange(e) {
      this.type = e.value;
      this.getShopInfo(e.value);
    },
    async getShopInfo(status) {
      const { data } = await post('agent/site_open_account/page', {
        page: this.page,
        limit: this.limit,
        searchModel: {
          status: status,
        },
      });
      this.pageData = data;
    },
  },
};
</script>

<style lang="scss">
.page-jihuo {
  .m-card {
    display: block;
    margin-bottom: 30rpx;
    overflow: hidden;
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
        &.blue {
          color: blue;
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
    margin-bottom: 30rpx;
    display: block;
    button {
      width: 100%;
    }
  }
}
</style>
