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
          <Card :paddingTop="false" v-for="item in codeList" :key="item.id">
            <view class="infos">
              <view class="item">
                <view class="col-l">编号</view>
                <view class="col-r">{{ item.codeId }}</view>
              </view>
              <view class="item">
                <view class="col-l">商户名称</view>
                <view class="col-r">{{ item.siteName || '' }}</view>
              </view>
              <view
                class="item"
                style="border-top:1px solid #dedede;justify-content: flex-end;"
                v-if="item.siteId"
              >
                <view class="col-l" style="padding-bottom:10rpx">
                  <van-button type="info" size="small" @click="jiebang(item)">解绑</van-button>
                </view>
              </view>
            </view>
          </Card>
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
    jiebang(item) {
      const _this = this;
      uni.showModal({
        content: `商户名称为${item.siteName}，绑定码牌为${item.codeId}，确认解除绑定?`,
        confirmText: '解绑',
        cancelText: '取消',
        success: async function(res) {
          if (res.confirm) {
            const { data } = await get('agent/code/unbundling', {
              codeId: item.codeId,
            });
            if (data) {
              uni.showToast({
                title: '解绑成功',
              });
              _this.getMyCode();
            }
          }
        },
      });
    },
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
.page-mycode {
  min-height: 100vh;
  background: #eee;
  .m-card {
    margin-bottom: 30rpx;
  }
  .infos {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      line-height: 80rpx;
      .col-l {
        color: rgba($color: #000000, $alpha: 0.7);
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
