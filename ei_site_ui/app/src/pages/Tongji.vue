<template>
  <view class="page-billing">
    <view class="tab-hd">
      <view class="title" :class="{ active: type === index }" v-for="(item, index) in titleList" :key="index" @click="type = index">{{ item }}</view>
    </view>
    <view class="search">
      <view class="sousuo">
        <view class="start-t" @click="showTime(1)">{{ startTime || "开始时间" }}</view>
        <view class="start-t" @click="showTime(2)">{{ endTime || "结束时间" }}</view>
        <van-button type="info" class="ui-button" @click="getData('search')">
          搜索
        </van-button>
      </view>
      <view class="tongjixinxi">
        <view class="item">开票金额:{{ tongjixinxi.sumMoney }}元</view>
        <view class="item">开票数量:{{ tongjixinxi.sumNumber }}张</view>
      </view>
    </view>
    <scroll-view class="tab-bd" scroll-y @scrolltolower="scrolltolower" :style="{ height: screenHeight + 'px' }">
      <template v-if="list.length > 0">
        <Card :paddingTop="false" v-for="item in list" :key="item.id">
          <view class="infos">
            <view class="item">
              <view class="col-l">发票类型</view>
              <view class="col-r">{{ invoiceType[item.invoiceType] }}</view>
            </view>
            <view class="item">
              <view class="col-l">开票金额</view>
              <view class="col-r">{{ item.money }}元</view>
            </view>
            <view class="item">
              <view class="col-l">开票数量</view>
              <view class="col-r">{{ item.number }}张</view>
            </view>
            <view class="item">
              <view class="col-l">开票时间</view>
              <view class="col-r">{{ item.outInvoiceTime.split(" ")[0] }}</view>
            </view>
          </view>
        </Card>
      </template>
      <van-empty description="暂无数据" v-else />
    </scroll-view>
    <van-popup :show="show" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker type="date" :value="startTimeV" @confirm="confirmTime" @cancel="show = false" v-show="timeType === 1" :max-date="new Date().getTime()" />
      <van-datetime-picker type="date" :value="endTimeV" @confirm="confirmTime" @cancel="show = false" v-show="timeType === 2" :max-date="new Date().getTime()" />
    </van-popup>
  </view>
</template>

<script>
import dayjs from "dayjs";
import ShopItem from "../components/ShopItem";
import { post } from "../../libs/request";
import Card from "../components/Card.vue";

export default {
  data() {
    return {
      type: 0,
      list: [],
      page: 1,
      limit: 10,
      types: "",
      titleList: ["开票统计", "冲红统计", "作废统计"],
      search: "",
      screenHeight: 0,
      pageLength: 0,
      startTime: "",
      startTimeV: Date.parse(new Date()),
      endTime: "",
      endTimeV: Date.parse(new Date()),
      show: false,
      timeType: 1,
      invoiceType: {
        4: "增值税专用纸票",
        7: "增值税普通纸票",
        26: "增值税普通电票",
        28: "增值税专用通电票",
      },
      tongjixinxi: {},
    };
  },
  onLoad(opt) {
    this.screenHeight = wx.getSystemInfoSync().windowHeight - 200;
  },
  onShow() {
    this.getData();
  },
  components: {
    Card,
  },
  watch: {
    type: function() {
      this.page = 1;
      this.startTime = "";
      this.startTimeV = "";
      this.endTime = "";
      this.endTimeV = "";
      this.getData();
    },
  },
  methods: {
    showTime(type) {
      this.timeType = type;
      this.show = true;
    },
    confirmTime(e) {
      if (this.timeType === 1) {
        this.startTime = dayjs(e.detail).format("YYYY-MM-DD");
      } else {
        this.endTime = dayjs(e.detail).format("YYYY-MM-DD");
      }
      this.show = false;
    },
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
    async getData(type) {
      let url = "site/site_day_invoice/page";
      switch (this.type) {
        case 0:
          url = "site/site_day_invoice/page";
          break;
        case 1:
          url = "site/site_day_red_invoice/page";
          break;
        case 2:
          url = "site/site_day_cancel_invoice/page";
          break;
        default:
          break;
      }
      if (type === "search") {
        if (this.startTime || this.endTime) {
          if (!this.startTime || !this.endTime) {
            return uni.showToast({
              title: "请选择时间",
              duration: 2000,
              icon: "none",
            });
          }
        }
        this.page = 1;
      }
      const { data, msg } = await post(url, {
        page: this.page,
        limit: this.limit,
        searchModel: {
          beginDate: this.startTime,
          endDate: this.endTime,
        },
      });
      this.pageLength = Number(msg || 0);
      this.tongjixinxi.sumMoney = data.sumMoney;
      this.tongjixinxi.sumNumber = data.sumNumber;
      if (type && type !== "search") {
        data.list.map((item) => {
          this.list.push(item);
        });
      } else {
        this.list = data.list;
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
  height: 100vh;
  background: #eee;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
    padding: 30rpx 0;
  }
  .m-card {
    display: block;
    margin: 0 30rpx 30rpx 30rpx;
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
}
.sousuo {
  display: flex;
  background: #fff;
  align-items: center;
  padding: 20rpx 32rpx;
  flex-direction: column;
  .start-t {
    width: 100%;
    font-size: 24rpx;
    flex: 1 0 auto;
    text-align: center;
    background: rgba($color: #000000, $alpha: 0.2);
    height: 80rpx;
    line-height: 80rpx;
    margin-bottom: 20rpx;
  }
  .ui-button {
    width: 100%;
    button {
      width: 100%;
    }
  }
}
.tongjixinxi {
  display: flex;
  justify-content: space-between;
  height: 80rpx;
  line-height: 80rpx;
  border-top: 1px solid #dedede;
  padding: 0 32rpx;
  font-size: 24rpx;
  background: #fff;
}
</style>
