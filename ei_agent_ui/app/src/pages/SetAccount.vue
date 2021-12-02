<template>
  <view class="page-add-acc">
    <Card title="输入账户信息">
      <CInput :value.sync="from.payee" label="户名" placeholder="请输入户名" :required="true"></CInput>
      <CInput :value.sync="from.cardNumber" label="账号" placeholder="请输入账号" :required="true" type="number"></CInput>
      <CInput :value.sync="from.bankAddress" label="户名" placeholder="请输入开户行" :required="true"></CInput>
      <CInput :value.sync="from.phone" label="手机号" placeholder="请输入手机号" :required="true" type="number"></CInput>
      <CInput :value.sync="from.companyName" label="银行名称" placeholder="请输入银行名称" :required="true"></CInput>
      <!-- <van-checkbox-group v-model="result">
        <van-cell-group>
          <van-cell title="设置为默认账户">
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group> -->
    </Card>
    <van-button type="info" class="ui-btn" @click="bind">确认绑定</van-button>
  </view>
</template>

<script>
import Card from '../components/Card.vue';
import CInput from "../components/CInput.vue";
import { get, post } from '../../libs/request';

export default {
  data() {
    return {
      from: {
        cardNumber: "",
        bankAddress: "",
        payee: "",
        phone: "",
        companyName: ""
      }
    }
  },
  components: {
    Card,
    CInput
  },
  methods: {
    async bind() {
      for (const item of Object.keys(this.from)) {
        if (!this.from[item]) {
          return uni.showToast({
            title: `请完善数据`,
            icon: 'none',
            duration: 2000,
          })
        }
      }
      const { code } = await post("agent/bank/info/save", this.from)
      if (code === 0) {
        uni.showToast({
          title: `绑定成功`,
          icon: 'none',
          duration: 2000,
        })
      }
    }
  }
}
</script>

<style lang="scss">
.page-add-acc {
  min-height: 100vh;
  padding: 30rpx;
  background: #eee;
  .m-card {
    .title {
      font-weight: bold;
      font-size: 34rpx;
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