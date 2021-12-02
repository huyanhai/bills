<template>
  <div class="mycode">
    <van-search v-model="search" label="搜索" placeholder="请输入企业名称" use-action-slot @search="changeSearch">
      <template #action>
        <div @click="searchData">搜索</div>
      </template>
    </van-search>
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="box">
        <Card v-for="item in pageData" :key="item.id">
          <div class="infos" @click="goPath(item)">
            <div class="item">
              <div class="col-l">状态</div>
              <div class="col-r red">{{ state[item.state] }}</div>
            </div>
            <div class="item">
              <div class="col-l">商户抬头</div>
              <div class="col-r">{{ item.sellerTitle }}</div>
            </div>
            <div class="item">
              <div class="col-l">购方抬头</div>
              <div class="col-r">{{ item.buyerTitle }}</div>
            </div>
            <div class="item">
              <div class="col-l">提交时间</div>
              <div class="col-r">{{ item.createTime }}</div>
            </div>
          </div>
        </Card>
      </div>
    </van-list>
  </div>
</template>

<script>
import Card from "../components/Card.vue";
import { get, post } from "../libs/request";
import { session } from "../libs/storage";

export default {
  data() {
    return {
      search: "",
      page: 1,
      limit: 50,
      pageData: [],
      pageLength: 0,
      state: {
        0: "待确认",
        1: "已确认",
        2: "开票成功",
        3: "已作废",
        4: "已冲红",
        5: "取消开票",
      },
      screenHeight: 0,
      loading: false,
      finished: false,
    };
  },
  components: {
    Card,
  },
  created() {
    let { token } = this.$route.query;
    console.log(token, this.$route);
    if (token) {
      session.set("token", token);
    }
  },
  async mounted() {
    await this.checkAuth();
    this.getData();
  },
  methods: {
    onLoad() {},
    checkAuth() {
      return get("p/validation/token");
    },
    goPath(item) {
      let path = `InvoiceInfo`;
      if (item.state === 0 || item.state === 5) {
        path = `CodeDetails`;
      }
      this.$router.push({
        name: path,
        query: {
          id: item.id,
        },
      });
    },
    scrolltolower() {
      if (this.pageData.length < this.pageLength) {
        this.page++;
        this.getData("add");
      } else {
        this.finished = true;
      }
    },
    changeSearch(e) {
      this.searchData();
    },
    searchData() {
      this.page = 1;
      this.getData();
    },
    async getData(type) {
      const { data, msg } = await post("user/invoice_info/page", {
        page: this.page,
        limit: this.limit,
        searchModel: {
          buyerTitle: this.search,
        },
      });
      this.pageLength = Number(msg || 0);
      if (type) {
        data.map((item) => {
          this.pageData.push(item);
        });
      } else {
        this.pageData = data;
      }
      this.finished = true;
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
  .box {
    padding: 15px;
    flex: 1 0 auto;
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
