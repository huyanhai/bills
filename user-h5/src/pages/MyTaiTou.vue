<template>
  <div class="page-null">
    <van-button class="m-button" type="primary" @click="addPage"> 新增 </van-button>
    <Card v-for="item in list" :key="item.id">
      <div class="infos" @click="goPath(item)">
        <div class="item">
          <div class="col-l">{{ item.type === 1 ? "企业名称" : "姓名" }}</div>
          <div class="col-r">{{ item.title }}</div>
        </div>
        <div class="item" v-if="item.taxNo">
          <div class="col-l">税号</div>
          <div class="col-r">{{ item.taxNo }}</div>
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
      page: 1,
      limit: 100,
      list: [],
    };
  },
  mounted() {
    this.getList();
  },
  components: {
    Card,
  },
  methods: {
    addPage() {
      this.$router.push({
        name: "AddTaiTou",
      });
    },
    goPath(item) {
      this.$router.push({
        name: `MyTaiTouXQ`,
        query: {
          id: item.id,
        },
      });
    },
    async getList() {
      const { code, data } = await post(`wechat/user_history_company/page`, {
        page: this.page,
        limit: this.limit,
        searchModel: {
          id: "",
        },
      });
      if (code === 0) {
        this.list = data;
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
  box-sizing: border-box;
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
        line-height: 15px;
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
