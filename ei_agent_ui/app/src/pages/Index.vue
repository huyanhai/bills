<template>
  <view class="page-index">
    <Card class="user-box">
      <view class="user">
        <view class="col-l">
          <open-data type="userAvatarUrl" class="post" />
          <view class="info">
            <view class="name">
              {{ data.agentName ? data.agentName : '票盟云' }}
              <van-tag round type="danger" style="margin-left:20rpx">{{
                agentRoleType[data.agentRole]
              }}</van-tag>
            </view>
            <view class="money"> 余额：{{ data.balance ? data.balance : '0.00' }} </view>
          </view>
        </view>
        <view class="col-r">
          <van-button round type="info" @click="goPath(`TiXian?balance=${data.balance}`)"
            >提现</van-button
          >
        </view>
      </view>
    </Card>
    <van-grid column-num="3" :border="false" class="c-tabs">
      <van-grid-item>
        <template #icon>
          <text class="text">今日收益</text>
        </template>
        <template #text>{{ statistical.todayEarnings }}</template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <text class="text">昨日收益</text>
        </template>
        <template #text>{{ statistical.yesterdayEarnings }}</template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <text class="text">累计收益</text>
        </template>
        <template #text>{{ statistical.sumEarnings }}</template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <text class="text">今日开票</text>
        </template>
        <template #text>{{ statistical.todayGetInvoice }}</template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <text class="text">昨日开票</text>
        </template>
        <template #text>{{ statistical.yesterdayGetInvoice }}</template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <text class="text">月开票</text>
        </template>
        <template #text>{{ statistical.monthGetInvoice }}</template>
      </van-grid-item>
    </van-grid>
    <Card title="常用功能">
      <van-grid class="van-box" column-num="3" :border="false">
        <van-grid-item
          :icon="require('../static/image/code.png')"
          text="我的码牌"
          @click="goPath('MyCode')"
        />
        <van-grid-item
          :icon="require('../static/image/install.png')"
          text="码牌安装"
          @click="goPath('BindCode')"
        />
        <van-grid-item
          :icon="require('../static/image/site.png')"
          text="我的商户"
          @click="goPath('MyShop')"
        />
        <van-grid-item
          :icon="require('../static/image/sy.png')"
          text="开户奖励"
          @click="goPath('ShouYi')"
        />
        <van-grid-item
          :icon="require('../static/image/zh.png')"
          text="广告收益"
          @click="goPath('AdShouYi')"
        />
        <van-grid-item
          :icon="require('../static/image/jh.png')"
          text="商户统计"
          @click="goPath('ShangHuTongJi')"
        />
        <van-grid-item
          :icon="require('../static/image/tj.png')"
          text="我的下级"
          @click="goPath('TuiJianList')"
        />
        <van-grid-item
          :icon="require('../static/image/yc.png')"
          text="异常开票"
          @click="goPath('YiChang')"
        />
      </van-grid>
    </Card>
    <van-dialog
      use-slot
      :show="show"
      show-cancel-button
      :overlay="true"
      @cancel="show = false"
      :showConfirmButton="false"
    >
      <view class="dialog-box">
        <view class="title">安装方式</view>
        <van-button type="info" class="ui-btn" @click="goPath('BindCode')">
          自己安装
        </van-button>
        <van-button type="info" class="ui-btn" @click="goPath('HelpMe')">
          帮我安装
        </van-button>
      </view>
    </van-dialog>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import { get } from '../../libs/request';
import Card from '../components/Card.vue';
import Dialog from '../wxcomponents/vant/dialog/dialog';

export default {
  data() {
    return {
      skip: false,
      userId: '',
      userInfo: {},
      data: {},
      statistical: {},
      show: false,
      agentRoleType: {
        1: '合伙人',
        2: '高级合伙人',
        3: '区域合伙人',
        4: ' 城市合伙人',
        5: '待定角色',
      },
    };
  },
  onShow() {
    let authCode = uni.getStorageSync('authCode');
    if (!authCode) {
      uni.showToast({
        title: '登录超时，请重新登录',
        icon: 'none',
        duration: 2000,
      });
      return uni.reLaunch({
        url: '/pages/Login',
      });
    }
    this.getData();
    this.getStatistical();
  },
  methods: {
    async getStatistical() {
      const { data } = await get('agent/login/statistical');
      if (data) {
        this.statistical = data;
      }
    },
    goPath(path) {
      uni.navigateTo({
        url: path,
      });
    },
    async getData() {
      const { data } = await get('agent/get/agent_info');
      if (data) {
        this.data = data;
        if (!data.osOpenid) {
          Dialog.confirm({
            title: '通知申请',
            message: '授权我们发送异常通知信息',
            confirmButtonText: '去授权',
          })
            .then(() => {
              uni.navigateTo({
                url: 'WebView',
              });
            })
            .catch(() => {});
        }
      }
    },
  },
  onHide() {
    this.show = false;
  },
  components: {
    Card,
  },
};
</script>

<style lang="scss">
.page-index {
  min-height: 100vh;
  padding: 30rpx;
  background: #eee;
  .dialog-box {
    box-sizing: border-box;
    padding: 30rpx;
    .title {
      text-align: center;
      font-size: 40rpx;
      margin-bottom: 30rpx;
    }
    .ui-btn {
      width: 100%;
      display: block;
      padding: 20rpx 0;
      box-sizing: border-box;
      .van-button {
        width: 100%;
      }
    }
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

  .c-tabs {
    margin-bottom: 30rpx;
    display: block;
    border-radius: 10rpx;
    overflow: hidden;
    .text {
      font-size: 28rpx;
      font-weight: bold;
    }
  }
  .van-box {
    width: 100%;
  }
}
</style>
