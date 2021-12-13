<template>
  <view class="page-billing">
    <view class="tab-hd">
      <view class="title" :class="{ active: type === index }" v-for="(item, index) in titleList" :key="index" @click="type = index">{{ item }}</view>
    </view>
    <view class="search">
      <van-search :value="search" label="搜索" placeholder="请输入公司名称或税号" use-action-slot @change="changeVal" @search="changeSearch">
        <view slot="action" @click="changeSearch">搜索</view>
      </van-search>
    </view>
    <scroll-view class="tab-bd" scroll-y @scrolltolower="scrolltolower" :style="{ height: screenHeight + 'px' }">
      <template v-if="list.length > 0">
        <ShopItem @itemClick="goPage(item)" :types="item.state" v-for="item in list" :key="item.id" :item="item" class="item" />
      </template>
      <van-empty description="暂无数据" v-else />
    </scroll-view>
  </view>
</template>

<script>
import ShopItem from "../components/ShopItem";
import { post } from "../../libs/request";
export default {
  data() {
    return {
      type: "1",
      list: [],
      page: 1,
      limit: 10,
      types: "",
      titleList: ["待开票", "已开票", "冲红"],
      search: "",
      screenHeight: 0,
      pageLength: 0,
    };
  },
  onLoad(opt) {
    const { type } = opt;
    if (type) {
      this.type = Number(type);
    }
    this.screenHeight = wx.getSystemInfoSync().windowHeight - 50;
  },
  onShow() {
    this.getData();
  },
  watch: {
    type: function() {
      this.page = 1;
      this.getData();
    },
  },
  methods: {
    scrolltolower() {
      if (this.list.length < this.pageLength) {
        this.page++;
        this.getData("add");
      }
    },
    changeVal(e) {
      this.search = e.detail;
    },
    changeSearch(e) {
      this.page = 1;
      this.list = [];
      this.getData();
    },
    goPage(item) {
      let url = "";
      switch (this.type) {
        case 0:
          url = `WaitingDetails?id=${item.id}`;
          break;
        case 1:
          // url = "Billed";
          if (item.state === 5) {
            url = `Billed?id=${item.id}&type=red`;
          } else {
            url = `InvoiceInfo?to=Billed&id=${item.id}`;
          }

          break;
        case 2:
          // url = "Red";
          url = `InvoiceInfo?to=Red&id=${item.id}`;
          break;
        default:
          break;
      }
      uni.navigateTo({
        url: `${url}`,
      });
    },
    async getData(type) {
      const { data, msg } = await post("site/invoice_info/page", {
        page: this.page,
        limit: this.limit,
        searchModel: {
          stateSearch: this.type,
          queryParam: this.search,
        },
      });
      this.pageLength = Number(msg || 0);
      if (type) {
        data.map((item) => {
          this.list.push(item);
        });
      } else {
        this.list = data;
      }
    },
  },
  components: {
    ShopItem,
  },
};
</script>

<style lang="scss">
.page-billing {
  min-height: 100vh;
  background: #eee;
  display: flex;
  flex-direction: column;
  .tab-hd {
    display: flex;
    align-items: center;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    flex: 0 0 auto;
    background: #fff;
    .title {
      width: calc(100% / 3);
      text-align: center;
      position: relative;
      color: rgba($color: #000000, $alpha: 0.6);
      cursor: pointer;
      &.active {
        color: #1989fa;
        &::before {
          position: absolute;
          width: 100rpx;
          height: 4rpx;
          background: #1989fa;
          display: block;
          content: "";
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .search {
    flex: 0 0 auto;
  }
  .tab-bd {
    flex: 1 0 auto;
    min-height: 20vh;
    box-sizing: border-box;
    .card-item {
      margin: 30rpx 30rpx 0 30rpx;
    }
  }
}
</style>
