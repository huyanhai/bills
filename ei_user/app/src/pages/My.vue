<template>
  <view class="page-my">
    <Card class="user-box">
      <view class="user">
        <view class="col-l">
          <open-data type="userAvatarUrl" class="post" />
          <view class="info">
            <view class="name">
              {{ userInfo.agentName ? userInfo.agentName : "票盟云" }}
            </view>
            <view class="money">
              编号：000000
            </view>
          </view>
        </view>
        <view class="col-r">
          <!-- <van-button round type="info">提现</van-button> -->
        </view>
      </view>
    </Card>
    <van-cell is-link center>
      <template #icon>
        <image
          :src="require('../static/image/recruit.png')"
          mode=""
          class="cell-icon"
        />
      </template>
      <template #title>
        <span class="custom-title">合伙人招募</span>
      </template>
    </van-cell>
    <van-cell is-link center>
      <template #icon>
        <image
          :src="require('../static/image/task.png')"
          mode=""
          class="cell-icon"
        />
      </template>
      <template #title>
        <span class="custom-title">任务中心</span>
      </template>
    </van-cell>
    <van-cell is-link center>
      <template #icon>
        <image
          :src="require('../static/image/task.png')"
          mode=""
          class="cell-icon"
        />
      </template>
      <template #title>
        <span class="custom-title">积分明细</span>
      </template>
    </van-cell>
  </view>
</template>

<script>
import Card from "../components/Card.vue";

export default {
  components: {
    Card,
  },
};
</script>

<style lang="scss">
.page-my {
  min-height: 100vh;
  padding: 30rpx;
  background: #eee;
  .cell-icon {
    width: 30rpx;
    height: 30rpx;
    margin-right: 20rpx;
  }
  .user-box {
    margin-bottom: 30rpx;
    display: block;

    .user {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .col-l {
        display: flex;
        align-items: center;
        flex: 1 0 auto;
        width: 50%;
      }
      .col-r {
        button {
          height: initial;
        }
      }
      .post {
        flex: 0 0 auto;
        width: 100rpx;
        height: 100rpx;
        border-radius: 10rpx;
      }
      .info {
        flex: 1 0 auto;
        margin-left: 30rpx;
        .name {
          font-weight: bold;
          font-size: 28rpx;
        }
        .money {
          font-size: 24rpx;
        }
      }
    }
  }
}
</style>
