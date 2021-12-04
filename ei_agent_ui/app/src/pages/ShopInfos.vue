<template>
  <view class="shop-infos">
    <view class="ui-btn">
      <van-button class="m-button1" type="info" @click="goPage">
        新增
      </van-button>
    </view>
    <view class="box" v-for="(item, index) in pageData" :key="index">
      <view class="item">
        <view class="col-l">开票名称</view>
        <view class="col-r">{{ item.goodsName }}</view>
      </view>
      <view class="item">
        <view class="col-l">税收编号</view>
        <view class="col-r">{{ item.code }}</view>
      </view>
      <view class="item">
        <view class="col-l">税率</view>
        <view class="col-r">{{ item.taxRate }}</view>
      </view>
      <view class="buttom">
        <van-button class="m-button" type="info" size="mini" @click="editItem(item)">
          修改税率
        </van-button>
        <van-button class="m-button" type="danger" size="mini" @click="deleteItem(item.id)">
          删除
        </van-button>
      </view>
    </view>

    <van-dialog
      use-slot
      :show="show"
      show-cancel-button
      @confirm="dialogConfirm"
      :overlay="true"
      @cancel="show = false"
    >
      <view class="dialog-box">
        <CInput
          :value.sync="editInfo.taxRate"
          placeholder="请输入税收编码"
          label="税收编码"
          use-button-slot
        >
          %
        </CInput>
      </view>
    </van-dialog>
  </view>
</template>

<script>
import CInput from '../components/CInput.vue';
import { post, get } from '../../libs/request';
export default {
  data() {
    return {
      id: '',
      page: 1,
      limit: 100,
      pageData: {},
      show: false,
      editInfo: {
        id: '',
        taxRate: '',
      },
    };
  },
  onLoad(e) {
    const { id } = e;
    if (id) {
      this.id = id;
    }
  },
  onShow() {
    this.getGoods();
  },
  components: {
    CInput,
  },
  methods: {
    deleteItem(id) {
      const vm = this;
      uni.showModal({
        title: '',
        content: '确定删除?',
        confirmText: '删除',
        success: async function(res) {
          if (res.confirm) {
            const { data } = await get('agent/goods/delete', {
              goodsId: id,
            });
            if (data) {
              uni.showToast({
                title: '删除成功',
              });
              vm.getGoods();
            }
          }
        },
      });
    },
    editItem(item) {
      this.editInfo.id = item.id;
      this.editInfo.taxRate = item.taxRate.replace('%', '');
      this.show = true;
    },
    async dialogConfirm() {
      if (!this.editInfo.taxRate) {
        return uni.showToast({
          title: '税率为空',
          icon: 'none',
        });
      }
      const { code, data } = await post('agent/goods/update', {
        id: this.editInfo.id,
        taxRate: `${this.editInfo.taxRate}`,
      });
      if (code === 0) {
        uni.showToast({
          title: '修改成功',
          icon: 'none',
        });
        this.show = false;
        setTimeout(() => {
          this.getGoods();
        }, 1000);
      }
    },
    async getGoods() {
      const { data } = await post('agent/goods/page', {
        page: this.page,
        limit: this.limit,
        searchModel: {
          siteId: this.id,
        },
      });
      if (data) {
        this.pageData = data;
      }
    },
    goPage() {
      uni.navigateTo({
        url: `BindShop?id=${this.id}&type=close`,
      });
    },
  },
};
</script>

<style lang="scss">
.shop-infos {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 30rpx;
  background: #eee;
  .box {
    box-sizing: border-box;
    padding: 30rpx;
    margin-bottom: 30rpx;
    background: #fff;
    .m-button {
      margin-right: 20rpx;
    }
  }
  .item {
    display: flex;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
    justify-content: space-between;
    display: flex;
    font-size: 28rpx;
    .buttom {
      display: flex;
      font-size: 24rpx;
      color: rgba($color: #000000, $alpha: 0.5);
      justify-content: space-between;
      margin-top: 20rpx;
    }
  }
  .dialog-box {
    box-sizing: border-box;
    padding: 30rpx;
  }

  .ui-btn {
    width: 100%;
    display: block;
    padding: 0 0 30rpx 0;
    box-sizing: border-box;
    .van-button {
      width: 100%;
    }
  }
}
</style>
