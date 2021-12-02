<template>
  <view class="mycode">
    <van-search :value="search" label="搜索" placeholder="请输入企业名称" use-action-slot @change="changeVal" @search="changeSearch">
      <view slot="action" @click="searchData">搜索</view>
    </van-search>
    <scroll-view class="box" scroll-y @scrolltolower="scrolltolower" :style="{ height: screenHeight + 'px' }">
      <Card v-for="item in pageData" :key="item.id">
        <view class="infos" @click="goPath(item)">
          <view class="item">
            <view class="col-l">状态</view>
            <view class="col-r red">{{ state[item.state] }}</view>
          </view>
          <view class="item">
            <view class="col-l">商户抬头</view>
            <view class="col-r">{{ item.sellerTitle }}</view>
          </view>
          <view class="item">
            <view class="col-l">购方抬头</view>
            <view class="col-r">{{ item.buyerTitle }}</view>
          </view>
          <view class="item">
            <view class="col-l">提交时间</view>
            <view class="col-r">{{ item.createTime }}</view>
          </view>
        </view>
      </Card>
    </scroll-view>
  </view>
</template>

<script>
import Card from "../components/Card.vue";
import { get, post } from "../../libs/request";

export default {
  data() {
    return {
      search: "",
      page: 1,
      limit: 10,
      pageData: [],
      pageLength: 0,
      state: {
        0: "待确认",
        1: "已确认",
        2: "开票成功",
        3: "已作废",
        4: "已冲红",
        5: "取消开票",
        6: "验签中",
        7: "红票验签中",
      },
      screenHeight: 0,
    };
  },
  components: {
    Card,
  },
  onLoad() {
    this.screenHeight = wx.getSystemInfoSync().windowHeight - 50;
  },
  async onShow() {
    await this.checkAuth();
    this.getData();
  },
  methods: {
    checkAuth() {
      return get("p/validation/token");
    },
    goPath(item) {
      let url = `InvoiceInfo?id=${item.id}`;
      if (item.state === 0 || item.state === 5) {
        url = `CodeDetails?id=${item.id}`;
      }
      uni.navigateTo({
        url: url,
      });
    },
    scrolltolower() {
      if (this.pageData.length < this.pageLength) {
        this.page++;
        this.getData("add");
      }
    },
    changeVal(e) {
      this.search = e.detail;
    },
    changeSearch(e) {
      this.getData();
    },
    searchData() {
      this.page = 1;
      this.getData();
    },
    async getData(type) {
      const { data, msg } = await post("user/invoice_info/page", {
        page: this.page,
        limit: this.limit,
        searchModel: {
          buyerTitle: this.search,
          queryParam: this.search,
        },
      });
      this.pageLength = Number(msg || 0);
      if (type) {
        data.map((item) => {
          this.pageData.push(item);
        });
      } else {
        this.pageData = data;
      }
    },
  },
};
</script>

<style lang="scss">
.mycode {
  height: 100vh;
  background: #eee;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .box {
    padding: 30rpx;
    flex: 1 0 auto;
    height: 500rpx;
    width: 100%;
    box-sizing: border-box;
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
        .red {
          color: red;
        }
        .col-l {
          color: rgba($color: #000000, $alpha: 0.7);
          &.l {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgb(235, 237, 240, 0.5);
          }
        }
      }
    }
  }
}
</style>
