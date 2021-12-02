<template>
  <view class="page-mycode">
    <van-tabs :active="type" @change="onChange" color="#1989fa">
      <van-tab title="我的码牌" name="1">
        <scroll-view
          style="height:100%; "
          scroll-y="true"
          bindscrolltolower="onQueryByPage"
          class="my-code"
        >
          <view class="code-box" v-for="item in codeList" :key="item.id">
            <view class="col-l">{{ item.codeId }}</view>
            <view class="col-r">{{ item.siteName || '' }}</view>
          </view>
        </scroll-view>
      </van-tab>
      <van-tab title="码牌入库" name="2">
        <view class="box">
          <view v-if="updateType == 1" class="single_view">
            <view class="code_view">码牌编号：{{ codeId || '' }}</view>
            <van-button class="m-button" type="warning" @click="onScanCode">
              扫描码牌
            </van-button>
          </view>
          <view v-else class="input-box">
            <van-cell-group>
              <CInput :value.sync="startNo" placeholder="请输入手机号" label="开始编号" />
              <CInput :value.sync="endNo" placeholder="请输入手机号" label="结束编号" />
            </van-cell-group>
          </view>
          <van-button class="m-button" type="info" @click="onSubmit">
            提 交
          </van-button>
        </view>
      </van-tab>
    </van-tabs>
  </view>
</template>

<script>
import CInput from '../components/CInput.vue';
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';
export default {
  data() {
    return {
      type: '2',
      userId: '',
      updateType: '1',
      startNo: '',
      endNo: '',
      codeId: '',
      page: 1,
      limit: 100,
      codeList: [],
    };
  },
  methods: {
    async getMyCode() {
      const { data } = await post('agent/sys_code_card/page', {
        page: this.page,
        limit: this.limit,
        searchModel: {
          id: '',
        },
      });
      if (data) {
        this.codeList = data;
      }
    },
    onChange(e) {
      this.type = e.detail?.name;
      if (this.type === '1') {
        this.getMyCode();
      }
    },
    radioChange(e) {
      this.updateType = e.detail;
    },
    onScanCode() {
      let that = this;
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode', 'barCode'],
        success: function(res) {
          let url = res.result;
          let code = url.split('/') || [];
          let codeId = code[code.length - 1];
          that.checkId(codeId);
        },
      });
    },
    onSubmit() {
      if (!this.codeId) {
        return uni.showToast({
          icon: 'error',
          title: '没有号码',
        });
      }
      this.putCode();
    },
    async checkId(codeId) {
      const { data, msg } = await get('agent/query/code/status', {
        codeId: codeId,
      });
      if (!data) {
        return uni.showToast({
          icon: 'error',
          title: msg,
        });
      } else {
        // this.codeId = this.codeId.substring(0, this.codeId.length - 1);
        this.codeId += `${codeId},`;
      }
    },
    async putCode() {
      const { code } = await post('agent/put/code', { codeId: this.codeId });
      if (code === 0) {
        uni.showToast({
          icon: 'success',
          title: '码牌入库成功',
        });
      }
    },
  },
  components: {
    CInput,
    Card,
  },
};
</script>

<style lang="scss">
.box {
  box-sizing: border-box;
  padding: 30rpx;
}
.m-radio {
  margin: 30rpx auto 0 auto;
  display: block;
  .van-radio-group--horizontal {
    justify-content: center;
  }
}
.m-button {
  display: block;
  margin-bottom: 30rpx;
  button {
    width: 100%;
  }
}
.input-box,
.code_view {
  margin: 60rpx 0;
}
.my-code {
  padding: 30rpx;
  box-sizing: border-box;
  .m-button {
    margin-top: 60rpx;
  }
}
.code-box {
  font-size: 28rpx;
  margin-bottom: 30rpx;
  display: flex;
  box-sizing: border-box;
  padding: 10rpx 30rpx;
  height: 100rpx;
  align-items: center;
  justify-content: space-between;
  background: rgba($color: #000000, $alpha: 0.05);
  border-radius: 5px;
  .col-r {
    font-size: 24rpx;
    color: rgba($color: #000000, $alpha: 0.5);
  }
}
</style>
