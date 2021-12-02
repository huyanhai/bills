<template>
  <view class="page-jihuo">
    <Tabs :titleList="titleList" @itemChange="itemChange">
      <template v-if="pageData.length > 0">
        <ShopItem
          v-for="item in pageData"
          :key="item.id"
          class="shop-item"
          :item="item"
          :types="active"
          @succrss="getData"
        />
      </template>
      <van-empty description="暂无数据" v-else />
    </Tabs>
  </view>
</template>

<script>
import Tabs from '../components/Tabs.vue';
import { get, post } from '../../libs/request';
import ShopItem from '../components/ShopItem1.vue';
export default {
  components: {
    Tabs,
    ShopItem,
  },
  data() {
    return {
      active: 1,
      titleList: [
        {
          name: '我发起',
          value: 1,
        },
        {
          name: '我接受',
          value: 2,
        },
      ],
      page: 1,
      limit: 100,
      pageData: [],
    };
  },
  onShow() {
    this.getData();
  },
  methods: {
    openShop() {},
    async getData() {
      const url =
        this.active === 1
          ? 'agent/install_order/entrust/page'
          : 'agent/install_order/receiver/page';
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
      this.active = e.value;
      this.getData();
    },
  },
};
</script>

<style lang="scss">
.page-jihuo {
  .shop-item {
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
