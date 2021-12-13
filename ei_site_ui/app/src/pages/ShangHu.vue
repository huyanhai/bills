<template>
  <view class="page-jihuo">
    <van-button type="info" class="ui-btn" @click="goPath('AddShangHu')">新增开票员</van-button>
    <template v-if="pageData.length > 0">
      <scroll-view scroll-y :style="{ height: screenHeight + 'px' }">
        <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
          <view class="ly" @click="goPath(`AddShangHu?id=${item.id}`)"></view>
          <view class="infos">
            <view class="item">
              <view class="col-l">开票员</view>
              <view class="col-r">{{ item.name }}</view>
            </view>
            <view class="item">
              <view class="col-l">手机号</view>
              <view class="col-r">{{ item.phone }}</view>
            </view>
            <view class="item">
              <view class="col-l">状态</view>
              <view class="col-r" @click="onChange(item.id)"><van-switch :checked="item.state" :active-value="1" :inactive-value="2" size="16px"/></view>
            </view>
          </view>
        </Card>
      </scroll-view>
    </template>
    <van-empty description="暂无数据" v-else />
  </view>
</template>

<script>
import Tabs from "../components/Tabs.vue";
import Card from "../components/Card.vue";
import { get, post } from "../../libs/request";

export default {
  components: {
    Tabs,
    Card,
  },
  data() {
    return {
      page: 1,
      limit: 100,
      pageData: [],
      screenHeight: 0,
      pageLength: 0,
      url: "",
      state: {
        1: "正常",
        2: "禁用",
      },
    };
  },
  onLoad() {
    this.screenHeight = wx.getSystemInfoSync().windowHeight - 50;
  },
  onShow() {
    this.getData();
  },
  methods: {
    // scrolltolower() {
    //   if (this.pageData.length < this.pageLength) {
    //     this.page++;
    //     this.getData(this.url, "add");
    //   }
    // },
    async onChange(id) {
      let { code, msg } = await get(`site/site_account/update/state`, {
        id: id,
      });
      if (code === 0) {
        uni.showToast({
          title: msg,
          icon: "none",
        });
        this.getData();
      }
    },
    goPath(path) {
      uni.navigateTo({
        url: path,
      });
    },
    formate(time = "") {
      return time.split(" ")[0];
    },
    openShop() {},
    async getData(url) {
      const { data, code, msg } = await post("site/site_account/page", {
        page: this.page, //页面
        limit: this.limit, //页容量，不传默认10
        searchModel: {
          //查询条件
          id: "",
        },
      });
      if (code === 0) {
        this.pageData = data;
      }
    },
    itemChange(e) {
      this.url = "site/site_estimate/page";
      if (e.value === 2) {
        this.url = "site/site_estimate_ok/page";
      }
      this.typeValue = e;
      this.getData(this.url);
    },
  },
};
</script>

<style lang="scss">
.page-jihuo {
  padding: 30rpx;
  min-height: 100vh;
  background: #eee;
  box-sizing: border-box;
  button {
    width: 100%;
    margin-bottom: 30rpx;
  }
  .m-card {
    display: block;
    margin-bottom: 30rpx;
    position: relative;
    .ly {
      position: absolute;
      top: 0;
      height: 100%;
      left: 0;
      width: 100%;
    }
  }
  .infos {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      line-height: 60rpx;
      .col-l {
        color: rgba($color: #000000, $alpha: 0.7);
      }
      .col-r {
        .van-switch {
          vertical-align: middle;
        }
        &.red {
          color: red;
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
    margin-top: 60rpx;
    display: block;
    button {
      width: 100%;
    }
  }
}
</style>
