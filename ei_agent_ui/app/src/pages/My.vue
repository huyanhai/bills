<template>
  <view class="page-my">
    <van-row custom-class="hade_view">
      <van-col span="6">
        <view class="user_avatar_view">
          <open-data type="userAvatarUrl" />
        </view>
      </van-col>
      <van-col span="12">
        <view class="user_name_view">{{ data.agentName }}</view>
        <view class="user_no_view">账号:{{ data.phone }}</view>
      </van-col>
    </van-row>
    <view class="data_detail_view">
      <van-row>
        <van-col span="12">
          <view class="right_data">
            <view class="data_view">待结算:{{ shouyi ? shouyi : '0.00' }}</view>
            <view class="data_value">
              <van-button class="tixian-btn" round type="info" @click="goPath(`JieSuanJiLu`)">
                结算记录
              </van-button>
            </view>
          </view>
        </van-col>
        <van-col span="12">
          <view class="left_data">
            <view class="data_view">余额:{{ data.balance ? data.balance : '0.00' }}</view>
            <view class="data_value">
              <van-button
                class="tixian-btn"
                round
                type="info"
                @click="goPath(`TiXian?balance=${data.balance}`)"
                >提现</van-button
              >
            </view>
          </view>
        </van-col>
      </van-row>
    </view>
    <view class="operation_view">
      <van-row custom-class="operation_row" bindtap="onInComeDetail">
        <van-col span="2">
          <view class="logo_view">
            <image src="../static/image/crew.png"></image>
          </view>
        </van-col>
        <van-col span="20">
          <view class="operation_name" @click="goPath('ZhangHu')">对公账户</view>
        </van-col>
        <van-col span="2">
          <view class="skip_view">
            <image src="../static/image/skip.png"></image>
          </view>
        </van-col>
      </van-row>
      <van-row custom-class="operation_row" bindtap="onInComeDetail">
        <van-col span="2">
          <view class="logo_view">
            <image src="../static/image/income.png"></image>
          </view>
        </van-col>
        <van-col span="20">
          <view class="operation_name" @click="goPath('MyBalance')">我的账单</view>
        </van-col>
        <van-col span="2">
          <view class="skip_view">
            <image src="../static/image/skip.png"></image>
          </view>
        </van-col>
      </van-row>
      <!-- <van-row custom-class="operation_row">
        <van-col span="2">
          <view class="logo_view">
            <image src="../static/image/statis.png"></image>
          </view>
        </van-col>
        <van-col span="20">
          <view class="operation_name">开票统计</view>
        </van-col>
        <van-col span="2">
          <view class="skip_view">
            <image src="../static/image/skip.png"></image>
          </view>
        </van-col>
      </van-row> -->
      <van-row custom-class="operation_row" bindtap="onUpdatePass">
        <van-col span="2">
          <view class="logo_view">
            <image src="../static/image/update.png"></image>
          </view>
        </van-col>
        <van-col span="20">
          <view class="operation_name" @click="goPath('EditPwd')">修改密码</view>
        </van-col>
        <van-col span="2">
          <view class="skip_view">
            <image src="../static/image/skip.png"></image>
          </view>
        </van-col>
      </van-row>
      <van-row custom-class="operation_row" v-if="userInfo.role == 1" @click="addSalesman">
        <van-col span="2">
          <view class="logo_view">
            <image src="../static/image/crew.png"></image>
          </view>
        </van-col>
        <van-col span="20">
          <view class="operation_name">添加业务员</view>
        </van-col>
        <van-col span="2">
          <view class="skip_view">
            <image src="../static/image/skip.png"></image>
          </view>
        </van-col>
      </van-row>
      <van-row custom-class="operation_row" bindtap="onOut">
        <van-col span="2">
          <view class="logo_view">
            <image src="../static/image/out.png"></image>
          </view>
        </van-col>
        <van-col span="20">
          <view class="operation_name" @click="logout">退出登录</view>
        </van-col>
        <van-col span="2">
          <view class="skip_view">
            <image src="../static/image/skip.png"></image>
          </view>
        </van-col>
      </van-row>
    </view>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import { get, post } from '../../libs/request';
import Dialog from '../wxcomponents/vant/dialog/dialog';
export default {
  data() {
    return {
      shouyi: '',
      data: {},
    };
  },
  onLoad() {
    this.getData();
    this.getShouYi();
  },
  methods: {
    async getShouYi() {
      const { code, data } = await get('agent/login/noSettlement');
      if (code === 0) {
        this.shouyi = data;
      }
    },
    async getData() {
      const { data } = await get('agent/get/agent_info');
      if (data) {
        this.data = data;
      }
    },
    async logout() {
      Dialog.confirm({
        title: '退出登录',
        message: '确认退出登录吗？',
      })
        .then(async () => {
          const { code } = await post('agent/log/out');
          if (code === 0) {
            uni.clearStorageSync('authCode');
            uni.reLaunch({
              url: 'Login',
            });
          }
        })
        .catch(() => {});
    },
    goPath(path) {
      uni.navigateTo({
        url: path,
      });
    },
  },
};
</script>

<style lang="scss">
.page-my {
  .tixian-btn {
    height: initial;
    button {
      height: initial;
      font-size: 24rpx;
    }
  }
  .hade_view {
    width: 100%;
    position: absolute;
    padding-top: 10rpx;
    background-color: #9eb5f1;
    height: 200rpx;
    top: 0px;
    z-index: 0;
  }
  .user_avatar_view {
    margin-left: 30rpx;
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    overflow: hidden;
  }
  .user_name_view {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 20rpx;
    font-size: 30rpx;
    font-weight: 700;
    color: #fff;
  }
  .user_no_view {
    margin-top: 10rpx;
    font-size: 28rpx;
    color: #fff;
  }
  .data_detail_view {
    position: relative;
    top: 110rpx;
    z-index: 2;
    margin: 30rpx;
    border-radius: 20rpx;
    height: 140rpx;
    border: 2rpx solid #9eb5f1;
    box-shadow: 0 0 20px rgb(40 94 238 / 70%);
    background-color: #fff;
  }
  .left_data {
    margin: 20rpx;
    text-align: center;
    border-left: 5rpx solid #cdcdcd;
  }
  .right_data {
    margin: 20rpx;
    text-align: center;
  }
  .data_view {
    font-size: 32rpx;
    font-weight: 700;
  }
  .data_value {
    margin-top: 10rpx;
    font-size: 28rpx;
  }
  .data_value span {
    color: #285eee;
  }
  .operation_view {
    margin-left: 30rpx;
    margin-top: 150rpx;
  }
  .operation_row {
    margin-top: 30rpx;
  }
  .logo_view image {
    width: 48rpx;
    height: 48rpx;
  }
  .skip_view image {
    margin-top: 10rpx;
    width: 36rpx;
    height: 36rpx;
  }
  .operation_name {
    margin-left: 10rpx;
    font-size: 32rpx;
    line-height: 48rpx;
  }
}
</style>
