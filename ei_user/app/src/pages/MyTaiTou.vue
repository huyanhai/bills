<template>
  <view class="page-null">
    <van-button class="m-button" type="info" @click="addPage">
      新增
    </van-button>
    <scroll-view class="box" scroll-y @scrolltolower="scrolltolower" :style="{ height: screenHeight + 'px' }">
      <Card v-for="item in list" :key="item.id">
        <view class="infos" @click="goPath(item)">
          <view class="item">
            <view class="col-l">{{ item.type === 1 ? "企业名称" : "姓名" }}</view>
            <view class="col-r">{{ item.title }}</view>
          </view>
          <view class="item" v-if="item.taxNo">
            <view class="col-l">税号</view>
            <view class="col-r">{{ item.taxNo }}</view>
          </view>
        </view>
      </Card>
    </scroll-view>
    <ad class="ad" unit-id="adunit-efa6b966bc742131"></ad>
  </view>
</template>

<script>
import Card from "../components/Card.vue";
import { get, post } from "../../libs/request";
import { userLogin } from "../../libs/auth";

export default {
  data() {
    return {
      page: 1,
      limit: 100,
      list: [],
      screenHeight: 0,
    };
  },
  async onLoad() {
    let authCode = uni.getStorageSync("authCode");
    if (!authCode) {
      await userLogin();
    }
    this.screenHeight = wx.getSystemInfoSync().windowHeight - 200;
  },
  onShow() {
    this.getList();
  },
  components: {
    Card,
  },
  methods: {
    addPage() {
      uni.navigateTo({
        url: `AddTaiTou`,
      });
    },
    goPath(item) {
      uni.navigateTo({
        url: `MyTaiTouXQ?id=${item.id}`,
      });
    },
    async getList() {
      const { code, data } = await post(`wechat/user_history_company/page`, {
        page: this.page,
        limit: this.limit,
        searchModel: {
          id: "",
        },
      });
      if (code === 0) {
        this.list = data;
      }
    },
    scrolltolower() {},
  },
};
</script>

<style lang="scss">
.ad {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60rpx;
  left: 0;
}
.page-null {
  height: 100vh;
  background: #eee;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 30rpx;
  .m-button {
    margin-bottom: 30rpx;
    button {
      width: 100%;
    }
  }
  .m-card {
    margin-bottom: 30rpx;
    .infos {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24rpx;
        line-height: 60rpx;
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
