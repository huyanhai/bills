<template>
  <view class="card-item">
    <view class="t-box" @click="$emit('itemClick')">
      <view class="more-info">
        <view class="name">
          <view>订单状态</view>
          <view style="color:red">{{ status[item.status] }}</view>
        </view>
        <view class="name">
          <view>商户名称</view>
          <view>{{ item.siteName }}</view>
        </view>
        <view class="name">
          <view>商户电话</view>
          <view>{{ item.phone }}</view>
        </view>
        <view class="name">
          <view>联系人</view>
          <view>{{ item.contacts }}</view>
        </view>
        <template v-if="types === '1'">
          <view class="name">
            <view>安装人</view>
            <view>{{ item.receiverAgentName }}</view>
          </view>
          <view class="name">
            <view>安装人电话</view>
            <view>{{ item.receiverAgentPhone }}</view>
          </view>
        </template>
        <template v-else>
          <view class="name">
            <view>委托人</view>
            <view>{{ item.entrustAgentName }}</view>
          </view>
          <view class="name">
            <view>委托人电话</view>
            <view>{{ item.entrustAgentPhone }}</view>
          </view>
        </template>
        <view class="name">
          <view>安装费</view>
          <view>{{ item.money }}元</view>
        </view>
        <view class="name">
          <view>安装地址</view>
          <view>{{ item.address }}</view>
        </view>
      </view>
      <image :src="item.shopImage"></image>
    </view>
    <view v-if="types === '1'" class="option">
      <van-button type="info" size="small" @click="wancheng(item.id)" v-if="item.status === 4">
        已安装
      </van-button>
    </view>
    <template v-else>
      <view class="option">
        <van-button type="info" size="small" @click="jiedan(item.id)" v-if="item.status === 1"
          >接单</van-button
        >
        <van-button
          type="info"
          size="small"
          @click="goBind('BindCode', item.siteId)"
          v-if="item.status === 2 || item.status === 3"
        >
          商户信息
        </van-button>
        <van-button
          type="info"
          size="small"
          @click="goShopInfos('ShopInfos', item.siteId)"
          v-if="item.status === 2 || item.status === 3"
        >
          配置发票
        </van-button>
        <van-button
          type="info"
          size="small"
          @click="goShopInfos('BindShop', item.siteId)"
          v-if="item.status === 2 || item.status === 3"
        >
          开票商品
        </van-button>
        <van-button
          type="info"
          size="small"
          @click="onScanCode(item)"
          v-if="iitem.status === 2 || item.status === 3"
          >绑定码牌</van-button
        >
        <van-button type="info" size="small" @click="goBind('BindCode2', item.siteId)">
          营业执照
        </van-button>
        <van-button type="info" size="small" @click="wancheng(item.id)" v-if="item.status === 3"
          >已安装</van-button
        >
      </view>
    </template>
  </view>
</template>

<script>
import { post, get } from '../../libs/request';

export default {
  props: {
    types: {
      type: String,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      code: '',
      status: {
        0: '商户未支付',
        1: '待接单',
        2: '已接单',
        3: '安装中',
        4: '安装成功',
        5: '完成安装',
      },
    };
  },
  methods: {
    async wancheng(id) {
      const vm = this;
      uni.showModal({
        content: `确认安装？`,
        confirmText: '绑定',
        cancelText: '取消',
        success: async function(res) {
          if (res.confirm) {
            let url = 'agent/install_order/receiver/finish';
            if (vm.types === '1') {
              url = 'agent/install_order/entrust/finish';
            }
            const { code } = await get(url, {
              installOrderId: id,
            });
            if (code === 0) {
              uni.showToast({
                title: '安装成功',
              });
              vm.$emit('succrss');
            }
          }
        },
      });
    },
    async jiedan(id) {
      uni.showModal({
        content: `确认安装？`,
        confirmText: '绑定',
        cancelText: '取消',
        success: async function(res) {
          if (res.confirm) {
            const { code } = await get('agent/install_order/receiver', {
              installOrderId: id,
            });
            if (code === 0) {
              uni.showToast({
                title: '接单成功',
              });
            }
          }
        },
      });
    },
    async tongbu(id) {
      const { code } = await get(
        'agent/synchronous/device',
        {
          siteId: id,
        },
        '同步中',
      );
      if (code === 0) {
        uni.showToast({
          title: '同步成功',
        });
      }
    },
    goShopInfos(type, id) {
      uni.navigateTo({
        url: `${type}?id=${id}`,
      });
    },
    onScanCode(item) {
      let that = this;
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode', 'barCode'],
        success: function(res) {
          let url = res.result;
          let code = url.split('/') || [];
          let codeId = code[code.length - 1];
          if (!code) {
            return uni.showToast({
              title: '二维码格式错误',
              duration: 2000,
              icon: 'error',
            });
          } else {
            that.code = codeId;
            that.showComfirm(item, codeId);
          }
        },
      });
    },
    showComfirm(item, id) {
      uni.showModal({
        content: `商品名称为${item.siteName}，绑定码牌为${id}，确认绑定?`,
        confirmText: '绑定',
        cancelText: '取消',
        success: async function(res) {
          if (res.confirm) {
            const { data } = await get('agent/site/binding/code_card', {
              siteId: item.id,
              codeCardId: id,
            });
            if (data) {
              uni.showToast({
                title: '绑定成功',
              });
            }
          }
        },
      });
    },
    goBind(path, id) {
      uni.navigateTo({
        url: `${path}?query=${id}`,
      });
    },
  },
};
</script>

<style lang="scss">
.card-item {
  background: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  box-sizing: border-box;
  position: relative;
  .t-box {
    display: flex;
    width: 100%;
  }
  .option {
    font-size: 24rpx;
    padding-top: 30rpx;
    display: flex;
    flex-wrap: wrap;
    button {
      margin-right: 20rpx;
      margin-bottom: 20rpx;
    }
  }
  .option1 {
    font-size: 28rpx;
    margin-bottom: 10rpx;
    display: flex;
    justify-content: space-between;
    .red {
      text {
        color: rgb(202, 70, 70);
      }
    }
    .active {
      text {
        color: green;
      }
    }
    .blue {
      text {
        color: rgb(22, 22, 211);
      }
    }
  }
  image {
    width: 200rpx;
    height: 200rpx;
    flex: 0 0 auto;
  }
  .more-info {
    margin-right: 30rpx;
    flex: 1 0 auto;
    width: 100%;
    .name {
      display: flex;
      justify-content: space-between;
      font-size: 28rpx;
      margin-bottom: 10rpx;
      view {
        &:first-child {
          color: rgba($color: #000000, $alpha: 0.5);
        }
      }
    }
    .time {
      font-size: 22rpx;
      color: rgba($color: #000000, $alpha: 0.5);
    }
    .item {
      display: flex;
      justify-content: space-between;
    }
  }
  .more {
    .type {
      font-size: 24rpx;
      color: rgb(202, 70, 70);
      font-weight: bold;
    }
    .money {
      font-size: 24rpx;
      color: rgb(202, 70, 70);
    }
  }
}
</style>
