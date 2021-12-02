<template>
  <view class="page-tixian">
    <view @click="show=true">
      <CInput :value.sync="from.bankName" label="收款账户" :disabled="true" placeholder="收款账户">
        <van-icon name="arrow-down" />
      </CInput>
    </view>
    <view @click="show1=true" v-if="from.bankId && from.bankId !== '0'">
      <CInput :value.sync="from.invoiceName" label="是否提供发票" :disabled="true" placeholder="是否提供发票">
        <van-icon name="arrow-down" />
      </CInput>
    </view>
    <CInput :value.sync="from.money" label="提现金额" placeholder="提现金额" use-button-slot type="number">
      <van-button size="small" type="info" @click="from.money = balance">
        全部提现
      </van-button>
    </CInput>
    <view class="money-tips">可提现金额:￥{{balance}}</view>
    <view class="tips">
      <view class="item">
        <view class="col-l">提现说明</view>
        <view class="col-r" @click="goPath('MyJiLu')">提现明细></view>
      </view>
      <view class="info">
        1.{{pageData.secondWithdrawalMoney}}元以下秒到，{{pageData.serviceCharge}}%手续费 <br>
        2.最大金额{{pageData.maxWithdrawalMoney}}
      </view>
      <van-button type="info" class="ui-btn" @click="tixian" v-if="pageData.onoff === 1">立即提现</van-button>
      <van-button type="info" class="ui-btn" @click="goPath('MyBalance')">我的账单</van-button>
    </view>
    <van-popup :show="show" position="bottom" :close-on-click-overlay="false">
      <van-picker :columns="bankData" @confirm="confirmItem" @cancel="show = false" show-toolbar value-key="companyName"></van-picker>
    </van-popup>
    <van-popup :show="show1" position="bottom" :close-on-click-overlay="false">
      <van-picker :columns="[{id:1,name:'是'},{id:2,name:'否'}]" @confirm="confirmItem1" @cancel="show = false" show-toolbar value-key="name">
      </van-picker>
    </van-popup>
  </view>
</template>

<script>
import CInput from '../components/CInput.vue';
import { get, post } from '../../libs/request';

export default {
  data() {
    return {
      from: {
        invoice: 2,
        invoiceName: "否",
        bankId: "",
        money: "",
        bankName: ""
      },
      pageData: {},
      bankData: [],
      show: false,
      show1: false,
      balance: ""
    }
  },
  components: {
    CInput
  },
  onLoad(e) {
    this.getPageData()
    this.getBank()
    const { balance } = e;
    this.balance = balance
  },
  methods: {
    async tixian() {
      const money = parseFloat(this.from.money)
      // const ruleMoney = this.pageData.minimumWithdrawalMoney + (this.pageData.withdrawalRiseMoney);
      // if (money < ruleMoney) {
      //   return uni.showToast({
      //     title: `提现金额不能小于${ruleMoney}`,
      //     icon: 'none',
      //     duration: 2000,
      //   })
      // }
      if (!this.from.bankName) {
        return uni.showToast({
          title: `请选择收款类型`,
          icon: 'none',
          duration: 2000,
        })
      }
      if (!this.from.money) {
        return uni.showToast({
          title: `请输入提现金额`,
          icon: 'none',
          duration: 2000,
        })
      }
      if (money > this.pageData.maxWithdrawalMoney) {
        return uni.showToast({
          title: `提现金额不能大于${this.pageData.maxWithdrawalMoney}`,
          icon: 'none',
          duration: 2000,
        })
      }
      const { code } = await post("agent/withdraw/info", {
        money: money,
        bankId: this.from.bankId,
        invoice: this.from.invoice
      })
      if (code === 0) {
        uni.showToast({
          title: `提现成功`,
          icon: 'none',
          duration: 2000,
        })
      }
    },
    confirmItem(e) {
      this.from.bankId = e.detail.value.id;
      this.from.bankName = e.detail.value.companyName;
      if (this.from.bankId === '0') {
        this.from.invoice = 2
        this.from.invoiceName = "否"
      }
      this.show = false;
    },
    confirmItem1(e) {
      this.from.invoice = e.detail.value.id;
      this.from.invoiceName = e.detail.value.name;
      this.show1 = false;
    },
    async getPageData() {
      const { data, code } = await get("agent/cash/rule");
      if (code === 0) {
        this.pageData = data
      }
    },
    async getBank() {
      const { data, code } = await get("agent/user/bank/info");
      if (code === 0) {
        this.bankData = data
      }
    },
    goPath(path) {
      uni.navigateTo({
        url: path
      })
    }
  }
}
</script>

<style lang="scss">
.page-tixian {
  min-height: 100vh;
  padding: 30rpx;
  background: #fff;
  .van-field__label--disabled {
    color: #646566;
  }
  .van-field__control--disabled {
    color: #323233;
  }
  .money-tips {
    font-size: 30rpx;
    color: red;
    margin: 20rpx 0;
  }
  .tips {
    margin-top: 30rpx;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 40rpx;
      .col-r {
        font-size: 28rpx;
        color: #1989fa;
      }
    }
    .info {
      font-size: 24rpx;
      color: rgba($color: #000000, $alpha: 0.5);
      margin: 20rpx 0 30rpx 0;
    }
  }
  .ui-btn {
    width: 100%;
    display: block;
    padding: 30rpx 0rpx;
    box-sizing: border-box;
    .van-button {
      width: 100%;
    }
  }
}
</style>