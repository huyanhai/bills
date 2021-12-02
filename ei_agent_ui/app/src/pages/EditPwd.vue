<template>
  <view class="page-editpwd">
    <CInput :value.sync="from.pass1" placeholder="请输入原始密码" />
    <CInput :value.sync="from.pass2" placeholder="请输入新密码" />
    <van-button type="info" class="ui-btn" @click="setPwd">确认修改</van-button>
  </view>
</template>

<script>
import { get } from "../../libs/request";
import CInput from "../components/CInput.vue";
export default {
  data() {
    return {
      from: {
        pass1: "",
        pass2: ""
      }
    }
  },
  components: {
    CInput
  },
  methods: {
    async setPwd() {
      if (!this.from.pass1 || !this.from.pass2) {
        return uni.showToast({
          title: "请输入原始密码或新密码",
          icon: "none",
          duration: 2000,
        });
      }
      const { code } = await get("agent/update/pw", this.from)
      if (code === 0) {
        uni.showToast({
          title: "密码修改成功",
          icon: "none",
          duration: 2000,
        });
      }
    }
  }
}
</script>

<style lang="scss">
.page-editpwd {
  min-height: 100vh;
  padding: 30rpx;
  background: #fff;
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