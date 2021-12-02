<template>
  <div class="page-null">
    <van-button class="m-button" type="primary" @click="editPage"> 修改 </van-button>
    <Card>
      <div class="infos">
        <div class="item">
          <div class="col-l">抬头类型</div>
          <div class="col-r" style="color: red">{{ type[info.type] }}</div>
        </div>
        <div class="item">
          <div class="col-l">企业名称</div>
          <div class="col-r">{{ info.title }}</div>
        </div>
        <div class="item" v-if="info.taxNo">
          <div class="col-l">税号</div>
          <div class="col-r">{{ info.taxNo }}</div>
        </div>
        <div class="item" v-if="info.address">
          <div class="col-l">地址</div>
          <div class="col-r">{{ info.address }}</div>
        </div>
        <div class="item" v-if="info.bank">
          <div class="col-l">银行账号</div>
          <div class="col-r">{{ info.bank }}</div>
        </div>
        <div class="item" v-if="info.phone">
          <div class="col-l">电话</div>
          <div class="col-r">{{ info.phone }}</div>
        </div>
        <div class="item" v-if="info.account">
          <div class="col-l">账号</div>
          <div class="col-r">{{ info.account }}</div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "../components/Card.vue";
import { get, post } from "../libs/request";

export default {
  data() {
    return {
      id: null,
      info: {},
      type: {
        1: "企业",
        2: "个人",
      },
    };
  },
  created(e) {
    const { id } = this.$route.query;
    if (id) {
      this.id = id;
      this.getList(id);
    }
  },
  components: {
    Card,
  },
  methods: {
    editPage() {
      this.$router.push({
        name: "AddTaiTou",
        query: {
          id: this.id,
        },
      });
    },
    async getList(id) {
      const { code, data } = await get(`wechat/user_history_company/${id}`);
      if (code === 0) {
        this.info = data;
      }
    },
  },
};
</script>

<style lang="scss">
.page-null {
  height: 100vh;
  background: #eee;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 15px;
  .m-button {
    margin-bottom: 15px;
    button {
      width: 100%;
    }
  }
  .m-card {
    margin-bottom: 15px;
    .infos {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        line-height: 30px;
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
