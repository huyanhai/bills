<template>
  <view class="page-null">
    <van-button class="m-button" type="info" @click="editPage">
      修改
    </van-button>
    <Card>
      <view class="infos">
        <view class="item">
          <view class="col-l">抬头类型</view>
          <view class="col-r" style="color:red">{{ type[info.type] }}</view>
        </view>
        <view class="item">
          <view class="col-l">企业名称</view>
          <view class="col-r">{{ info.title }}</view>
        </view>
        <view class="item" v-if="info.taxNo">
          <view class="col-l">税号</view>
          <view class="col-r">{{ info.taxNo }}</view>
        </view>
        <view class="item" v-if="info.address">
          <view class="col-l">地址</view>
          <view class="col-r">{{ info.address }}</view>
        </view>
        <view class="item" v-if="info.bank">
          <view class="col-l">银行账号</view>
          <view class="col-r">{{ info.bank }}</view>
        </view>
        <view class="item" v-if="info.phone">
          <view class="col-l">电话</view>
          <view class="col-r">{{ info.phone }}</view>
        </view>
        <view class="item" v-if="info.account">
          <view class="col-l">账号</view>
          <view class="col-r">{{ info.account }}</view>
        </view>
      </view>
    </Card>
  </view>
</template>

<script>
import Card from "../components/Card.vue";
import { get, post } from "../../libs/request";

export default {
  data() {
    return {
      id: null,
      info: {},
      type: {
        1: "企业",
        2: "个人",
      },
    };
  },
  onLoad(e) {
    const { id } = e;
    if (id) {
      this.id = id;
      this.getList(id);
    }
  },
  components: {
    Card,
  },
  methods: {
    editPage() {
      uni.navigateTo({
        url: `AddTaiTou?id=${this.id}`,
      });
    },
    async getList(id) {
      const { code, data } = await get(`wechat/user_history_company/${id}`);
      if (code === 0) {
        this.info = data;
      }
    },
  },
};
</script>

<style lang="scss">
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
