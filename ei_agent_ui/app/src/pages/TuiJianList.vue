<template>
  <view class="page-zhanghu">
    <van-button type="info" class="ui-btn" @click="add">新增下级</van-button>
    <Card :paddingTop="false" v-for="item in pageData" :key="item.id">
      <view class="infos">
        <view class="item">
          <view class="col-l">合伙人名称</view>
          <view class="col-r">{{ item.agentName }}</view>
        </view>
        <view class="item">
          <view class="col-l">手机号</view>
          <view class="col-r">{{ item.phone }}</view>
        </view>
        <view class="item">
          <view class="col-l">角色</view>
          <view class="col-r">{{ agentRole[item.agentRole] }}</view>
        </view>
        <view class="item">
          <view class="col-l">创建时间</view>
          <view class="col-r">{{ item.createTime }}</view>
        </view>
        <view class="item" style="border-top:1px solid #dedede;justify-content: flex-end;">
          <view class="col-l">
            <van-button type="info" size="mini" @click="jihuo(item)">激活</van-button>
          </view>
        </view>
      </view>
    </Card>
    <van-dialog
      use-slot
      :show="show"
      show-cancel-button
      confirmButtonText="支付"
      @confirm="dialogConfirm"
      :overlay="true"
      @cancel="show = false"
      @close="() => {}"
    >
      <view class="dialog-box">
        <van-radio-group :value="radioValue" @change="onChange">
          <van-radio :name="item.roleId" v-for="item in roleList" :key="item.id">
            {{ item.roleName }}
          </van-radio>
        </van-radio-group>
        <view class="tips">
          <view class="money">费用:￥{{ changeItem.money }}</view>
          <view class="info">{{ changeItem.describe }}</view>
        </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
import Card from '../components/Card.vue';
import { get, post } from '../../libs/request';

export default {
  data() {
    return {
      page: 1,
      limit: 100,
      pageData: {},
      agentRole: {
        1: '合伙人',
        2: '高级合伙人',
        3: '区域合伙人',
        4: '城市合伙人',
        5: '待定角色',
        6: '核心合伙人',
      },
      show: false,
      radioValue: '1',
      roleList: [],
      selItem: {},
      changeItem: {},
    };
  },
  components: {
    Card,
  },
  onLoad() {
    this.getRoleList();
  },
  onShow() {
    this.getPageData();
  },
  methods: {
    async dialogConfirm() {
      const { data, code } = await get('agent/activation/sub-agent', {
        agentId: this.selItem?.id,
        agentRole: this.changeItem?.roleId,
      });
      if (code === 0) {
        this.show = false;
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success() {
            _this.getStatus(data.orderNum);
          },
          fail(res) {
            uni.showToast({
              title: '支付失败',
              duration: 2000,
              icon: 'none',
            });
          },
        });
      }
    },
    async getStatus(orderNum) {
      const { data, code } = await get('agent/activation/sub-agent/wxpay/status', {
        orderNum: orderNum,
      });
      if (code === 0) {
        this.getPageData();
      }
    },
    onChange(e) {
      for (let item of this.roleList) {
        if (item.roleId === e.detail) {
          this.changeItem = item;
        }
      }
    },
    jihuo(item) {
      this.selItem = item;
      this.show = true;
    },
    add() {
      uni.navigateTo({
        url: 'TuiJian',
      });
    },
    async getRoleList() {
      const { data, code } = await get('agent/query/sub-agent/role');
      if (code === 0) {
        this.radioValue = data?.[0].roleId;
        this.changeItem = data?.[0];
        this.roleList = data;
      }
    },
    async getPageData() {
      const { data, code } = await post('agent/sub-agent/page', {
        page: this.page,
        limit: this.limit,
        searchModel: {
          id: '',
        },
      });
      if (code === 0) {
        this.pageData = data;
      }
    },
  },
};
</script>

<style lang="scss">
.page-zhanghu {
  min-height: 100vh;
  padding: 30rpx;
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
  .ui-btn {
    width: 100%;
    display: block;
    padding: 30rpx 0rpx;
    box-sizing: border-box;
    margin-bottom: 30rpx;
    .van-button {
      width: 100%;
    }
  }
}
.dialog-box {
  padding: 30rpx;
  .tips {
    font-size: 38rpx;
    color: red;
    margin-bottom: 30rpx;
    .info {
      font-size: 28rpx;
      color: #383838;
      margin-top: 20rpx;
    }
  }
}
.van-radio {
  margin: 30rpx 0;
}
</style>
