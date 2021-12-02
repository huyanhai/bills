<template>
  <div class="page-my">
    <Card class="user-box">
      <div class="user">
        <div class="col-l">
          <open-data type="userAvatarUrl" class="post" />
          <div class="info">
            <div class="name">
              {{ userInfo.agentName ? userInfo.agentName : "票盟云" }}
            </div>
            <div class="money">编号：000000</div>
          </div>
        </div>
        <div class="col-r">
          <!-- <van-button round type="info">提现</van-button> -->
        </div>
      </div>
    </Card>
    <van-cell is-link center>
      <template #icon>
        <image
          :src="require('../static/image/recruit.png')"
          mode=""
          class="cell-icon"
        />
      </template>
      <template #title>
        <span class="custom-title">合伙人招募</span>
      </template>
    </van-cell>
    <van-cell is-link center>
      <template #icon>
        <image
          :src="require('../static/image/task.png')"
          mode=""
          class="cell-icon"
        />
      </template>
      <template #title>
        <span class="custom-title">任务中心</span>
      </template>
    </van-cell>
    <van-cell is-link center>
      <template #icon>
        <image
          :src="require('../static/image/task.png')"
          mode=""
          class="cell-icon"
        />
      </template>
      <template #title>
        <span class="custom-title">积分明细</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import Card from "../components/Card.vue"

export default {
  components: {
    Card,
  },
}
</script>

<style lang="scss">
.page-my {
  min-height: 100vh;
  padding: 30px;
  background: #eee;
  .cell-icon {
    width: 30px;
    height: 30px;
    margin-right: 20px;
  }
  .user-box {
    margin-bottom: 30px;
    display: block;

    .user {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .col-l {
        display: flex;
        align-items: center;
        flex: 1 0 auto;
        width: 50%;
      }
      .col-r {
        button {
          height: initial;
        }
      }
      .post {
        flex: 0 0 auto;
        width: 100px;
        height: 100px;
        border-radius: 10px;
      }
      .info {
        flex: 1 0 auto;
        margin-left: 30px;
        .name {
          font-weight: bold;
          font-size: 28px;
        }
        .money {
          font-size: 24px;
        }
      }
    }
  }
}
</style>
