<template>
  <view class="card-item">
    <view class="t-box" @click="$emit('itemClick')">
      <view class="more-info">
        <view class="name">企业名称:{{ item.siteTitle || '' }}</view>
        <view class="name">企业税号:{{ item.siteTaxNo || '' }}</view>
        <view class="name">企业法人:{{ item.legalPerson || '' }}</view>
        <view class="name">联系电话:{{ item.phone || '' }}</view>
        <view class="name">绑定码牌:{{ item.codeId || '' }}</view>
      </view>
      <image :src="item.shopImage"></image>
    </view>
    <view class="option1">
      <view class="item active"
        >类型:<text>{{ industryCategory[item.industryCategory] }}</text>
      </view>
      <view class="item red" :class="{ active: item.state === 1 }"
        >状态:<text>{{ state[item.state] }}</text></view
      >
      <view class="item blue"
        >设备:<text>{{ item.taxPanelType === 1 ? 'U_KEY' : '税盘' }}</text></view
      >
    </view>
    <view class="option">
      <van-button type="info" size="small" @click="goShopInfos('ShopInfos', item.id)">
        开票商品
      </van-button>
      <van-button
        type="info"
        size="small"
        @click="goShopInfos('Device', item.id)"
        v-if="item.state === 1"
      >
        税控设备
      </van-button>
      <van-button type="info" size="small" @click="onScanCode(item)">新增码牌</van-button>
      <van-button type="info" size="small" @click="goBind('BindCode1', item.id)">
        开票信息
      </van-button>
      <!-- <van-button
        v-if="item.state !== 1"
        type="info"
        size="small"
        @click="goBind('BindCode2', item.id)"
      >
        营业执照
      </van-button> -->
      <van-button
        v-if="item.state !== 1"
        type="info"
        size="small"
        @click="goBind('BindCode', item.id)"
      >
        商户信息
      </van-button>
      <van-button type="info" size="small" @click="jihuo(item.id)" v-if="item.state === -1">
        商户激活
      </van-button>
    </view>
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
      state: {
        '-1': '未激活',
        0: '审核中',
        1: '已激活',
      },
      industryCategory: {
        0: '餐饮',
        1: '酒店',
        2: '其他',
      },
    };
  },
  methods: {
    jihuo(id) {
      this.$emit('jihuo', id);
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
    goBind(path, item) {
      uni.navigateTo({
        url: `${path}?query=${item}`,
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
      margin-right: 30rpx;
      margin-bottom: 30rpx;
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
        color: #409eff;
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
    width: 50%;
    word-break: break-all;
    .name {
      font-size: 28rpx;
      margin-bottom: 10rpx;
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
