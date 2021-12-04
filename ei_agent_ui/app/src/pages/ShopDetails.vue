<template>
  <view class="shop-details">
    <Card>
      <view class="infos">
        <view class="item">
          <view class="col-l">公司名称</view>
          <view class="col-r">{{ data.siteTitle || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">税号</view>
          <view class="col-r">{{ data.siteTaxNo || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">机器码</view>
          <view class="col-r">{{ data.machineCode || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">税控设备类型</view>
          <view class="col-r">{{ data.taxPanelType === 1 ? 'U_KEY' : '税盘' }}</view>
        </view>
        <view class="item">
          <view class="col-l">法人</view>
          <view class="col-r">{{ data.legalPerson || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">地址</view>
          <view class="col-r">{{ data.siteAddress || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">联系电话</view>
          <view class="col-r">{{ data.phone || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">行业</view>
          <view class="col-r">{{ data.industryCategory === 0 ? '餐饮' : '酒店' }}</view>
        </view>
        <view class="item">
          <view class="col-l">创建时间</view>
          <view class="col-r">{{ data.createTime || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">商户名称</view>
          <view class="col-r">{{ data.siteName || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">绑定码牌</view>
          <view class="col-r">{{ data.codeId || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">账号状态</view>
          <view class="col-r">{{ data.state === -1 ? '未激活' : '已激活' }}</view>
        </view>
        <view class="item">
          <view class="col-l">套餐到期时间</view>
          <view class="col-r">{{ data.expireTime || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">支持专票</view>
          <view class="col-r">{{ data.specialInvoice === 1 ? '支持' : '不支持' }}</view>
        </view>
        <view class="item">
          <view class="col-l">开票人</view>
          <view class="col-r">{{ data.drawer || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">复核人</view>
          <view class="col-r">{{ data.checker || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">收款人</view>
          <view class="col-r">{{ data.payee || '' }}</view>
        </view>
        <view class="item">
          <view class="col-l">客服电话</view>
          <view class="col-r">{{ data.servicePhone || '' }}</view>
        </view>
        <view class="item last-item">
          <view class="l">
            <view class="uploads">
              <image :src="data.licenseUrl" mode="" />
            </view>
            <text>营业执照</text>
          </view>
          <view class="l">
            <view class="uploads">
              <image :src="data.shopImage" mode="" />
            </view>
            <text>门 头 照</text>
          </view>
        </view>
      </view>
    </Card>
  </view>
</template>

<script>
import Card from '../components/Card.vue';
import { get } from '../../libs/request';

export default {
  data() {
    return {
      data: {},
      id: '',
    };
  },
  components: {
    Card,
  },
  onLoad(e) {
    const { id } = e;
    if (id) {
      this.id = id;
      this.getData();
    }
  },
  methods: {
    async getData() {
      const { data } = await get(`agent/query/site_info/id`, {
        siteId: this.id,
      });
      if (data) {
        this.data = data;
      }
    },
  },
};
</script>

<style lang="scss">
.shop-details {
  min-height: 100vh;
  background: #eee;
  box-sizing: border-box;
  padding: 30rpx;
  .m-card {
    margin-bottom: 30rpx;
  }
  .infos {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      line-height: 60rpx;
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
</style>
