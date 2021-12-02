<template>
  <div class="page-search">
    <van-radio-group @change="onChange" v-model="value">
      <van-radio :name="item.taxNo" :data-list="item" v-for="item in list" :key="item.taxNo">
        <div class="box">
          <div class="ui-title">{{ item.title }}</div>
          <div class="ui-text">{{ item.address }}</div>
        </div>
      </van-radio>
    </van-radio-group>
    <van-button class="m-button" type="info" @click="onSubmit"> 确定 </van-button>
  </div>
</template>

<script>
import { get } from "../libs/request";

export default {
  data() {
    return { companyCloudTitle: "", list: [], value: "" };
  },
  onLoad(e) {
    const { companyCloudTitle } = e;
    if (companyCloudTitle) {
      this.companyCloudTitle = companyCloudTitle;
      this.getData();
    }
  },
  methods: {
    async getData() {
      const { data } = await get(`wechat/get/zyh/companyCloudTitle?companyTitle=${this.companyCloudTitle}`, {
        companyTitle: this.companyCloudTitle,
      });
      if (data) {
        this.list = data;
      }
    },
    onChange(e) {
      for (const item of this.list) {
        if (item.taxNo === this.value) {
          uni.setStorageSync("taitou", item);
        }
      }
    },
    onSubmit() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss">
.page-search {
  box-sizing: border-box;
  padding: 30px;
  .m-button {
    margin-top: 60px;
    display: block;
    button {
      width: 100%;
    }
  }
  .van-radio__label {
    width: 100%;
  }
  .box {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    padding: 30px 0;
  }
  .ui-title {
    font-size: 28px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ui-text {
    font-size: 24px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba($color: #000000, $alpha: 0.5);
  }
}
</style>
