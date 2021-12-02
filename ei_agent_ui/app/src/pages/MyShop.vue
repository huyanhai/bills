<template>
  <view class="page-myshop">
    <view class="search">
      <van-search
        :value="search"
        label="搜索"
        placeholder="公司名称/商户名称"
        use-action-slot
        @change="changeVal"
        @search="changeSearch"
      >
        <view slot="action" @click="getData">搜索</view>
      </van-search>
    </view>
    <view class="box">
      <template v-if="shopList.length > 0">
        <ShopItem
          v-for="item in shopList"
          :key="item.id"
          class="shop-item"
          :item="item"
          @itemClick="goPage(item.id)"
          @jihuo="jihuo"
        />
      </template>
      <van-empty description="暂无数据" v-else />
    </view>
    <van-popup :show="showJihuo">
      <view class="jihuo-box">
        <view class="title">确认激活</view>
        <view class="tips">1.请确保税盘控Uk已插到联网服务器上</view>
        <view class="tips">2.税控设备密码必须是12345678</view>
        <van-button type="info" class="queren" :disabled="time > 0" @click="jihuoApi">
          {{ time < 1 ? '激活' : `${time}s` }}
        </van-button>
        <van-button type="warning" @click="showJihuo = false">
          取消
        </van-button>
      </view>
    </van-popup>
  </view>
</template>

<script>
import ShopItem from '../components/ShopItem.vue';
import { post, get } from '../../libs/request';

export default {
  data() {
    return {
      shopList: [],
      showJihuo: false,
      time: 3,
      id: null,
      page: 1,
      limit: 100,
      search: '',
    };
  },
  onShow() {
    this.getData();
  },
  methods: {
    changeSearch(e) {
      this.page = 1;
      this.getData();
    },
    changeVal(e) {
      this.search = e.detail;
    },
    countDown() {
      const vm = this;
      const timer = setInterval(() => {
        vm.time--;
        if (vm.time < 1) {
          clearInterval(timer);
        }
      }, 1000);
    },
    jihuo(e) {
      this.id = e;
      this.showJihuo = true;
      this.time = 3;
      this.countDown();
    },
    async jihuoApi() {
      const vm = this;
      const { code } = await get('agent/activate/account', {
        siteId: this.id,
      });
      if (code === 0) {
        uni.showToast({
          icon: 'none',
          title: '激活成功',
        });
        this.showJihuo = false;
        setTimeout(() => {
          vm.getData();
        }, 2000);
      }
    },
    goPage(e) {
      uni.navigateTo({
        url: `ShopDetails?id=${e}`,
      });
    },
    async getData() {
      const { data } = await post('agent/site_info/page', {
        page: this.page,
        limit: this.limit,
        searchModel: {
          company: this.search,
        },
      });
      if (data) {
        this.shopList = data;
      }
    },
  },
  components: {
    ShopItem,
  },
};
</script>

<style lang="scss">
.page-myshop {
  min-height: 100vh;
  background: #eee;
  box-sizing: border-box;
  .shop-item {
    margin-bottom: 30rpx;
    display: block;
  }
  .box {
    padding: 30rpx;
  }
}
.jihuo-box {
  padding: 30rpx;
  text-align: center;
  width: 600rpx;
  .title {
    margin-bottom: 40rpx;
    font-weight: bold;
  }
  .tips {
    margin-bottom: 40rpx;
    font-size: 34rpx;
  }
  .queren {
    margin-bottom: 20rpx;
    display: block;
  }
  button {
    width: 100%;
  }
}
</style>
