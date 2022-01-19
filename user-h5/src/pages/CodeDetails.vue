<template>
  <div class="mycode">
    <div class="box">
      <Card title="发票信息" :titleRight="state[pageData.state]">
        <div class="infos">
          <div class="item">
            <div class="col-l">商户抬头</div>
            <div class="col-r">{{ pageData.sellerTitle }}</div>
          </div>
          <div class="item">
            <div class="col-l">购方抬头</div>
            <div class="col-r">{{ pageData.buyerTitle }}</div>
          </div>
          <div class="item">
            <div class="col-l">公司税号</div>
            <div class="col-r">{{ pageData.buyerTaxNo }}</div>
          </div>
          <div class="item">
            <div class="col-l">开户行</div>
            <div class="col-r">{{ pageData.buyerBank }}</div>
          </div>
          <div class="item">
            <div class="col-l">银行账号</div>
            <div class="col-r">{{ pageData.buyerAccount }}</div>
          </div>
          <div class="item">
            <div class="col-l">地 址</div>
            <div class="col-r">{{ pageData.buyerAddress }}</div>
          </div>
          <div class="item">
            <div class="col-l">电 话</div>
            <div class="col-r">{{ pageData.buyerPhone }}</div>
          </div>
          <div class="item">
            <div class="col-l">邮 箱</div>
            <div class="col-r">{{ pageData.buyerEmail }}</div>
          </div>
          <div class="item">
            <div class="col-l">申请时间</div>
            <div class="col-r">{{ pageData.createTime }}</div>
          </div>
          <div class="item">
            <div class="col-l">开票描述</div>
            <div class="col-r">{{ pageData.description }}</div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from "../components/Card.vue";
import { get, post } from "../libs/request";

export default {
  data() {
    return {
      pageData: {},
      state: {
        0: "待确认",
        1: "验签中",
        2: "开票成功",
        3: "已作废",
        4: "已冲红",
        5: "取消开票",
        6: "开票中",
        7: "冲红中",
      },
      id: "",
    };
  },
  components: {
    Card,
  },
  created() {
    const { id } = this.$route.query;
    if (id) {
      this.id = id;
      this.getData();
    }
  },
  methods: {
    async getData() {
      const { data } = await get("user/get/invoice_info", {
        params: {
          id: this.id,
        },
      });
      console.log(data);
      this.pageData = data;
    },
    downLoad(url) {
      uni.setClipboardData({
        data: url,
        success() {
          uni.showModal({
            content: "复制成功，到浏览器打开下载",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
.mycode {
  min-height: 100vh;
  background: #eee;
  display: flex;
  flex-direction: column;
  .m-button {
    margin-bottom: 15px;
    display: block;
    button {
      width: 100%;
    }
  }
  .box {
    padding: 15px;
    flex: 1 0 auto;
    height: 50vh;
    width: 100%;
    box-sizing: border-box;
    .m-card {
      margin-bottom: 15px;
      padding: 0 15px;
    }
    .infos {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        line-height: 40px;
        .red {
          color: red;
        }
        .col-l {
          color: rgba($color: #000000, $alpha: 0.7);
          &.l {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgb(235, 237, 240, 0.5);
          }
        }
      }
    }
  }
}
</style>
