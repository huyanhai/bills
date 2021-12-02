<template>
  <div class="card-item" @click="$emit('itemClick')">
    <image src="../static/logo.png"></image>
    <div class="more-info">
      <div class="name">重庆淘电科技有限公司</div>
      <div class="time">2021-07-20 16:13:12</div>
    </div>
    <div class="more" v-if="types !== 0">
      <div class="type">
        {{ types === "1" ? "开票成功" : "冲红成功" }}
      </div>
      <div class="money">￥10.0</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    types: {
      type: String,
    },
  },
}
</script>

<style lang="scss">
.card-item {
  background: #fff;
  border-radius: 10px;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative;
  image {
    width: 80px;
    height: 80px;
  }
  .more-info {
    margin-left: 30px;
    .name {
      font-size: 28px;
      margin-bottom: 10px;
    }
    .time {
      font-size: 22px;
      color: rgba($color: #000000, $alpha: 0.5);
    }
  }
  .more {
    .type {
      position: absolute;
      right: 30px;
      top: 30px;
      font-size: 24px;
      color: rgb(202, 70, 70);
      font-weight: bold;
    }
    .money {
      position: absolute;
      right: 30px;
      bottom: 30px;
      font-size: 24px;
      color: rgb(202, 70, 70);
    }
  }
}
</style>
