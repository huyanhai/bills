<template>
  <van-field :type="type" :value="value" :placeholder="placeholder" :label="label" :title-width="titlew" :disabled="disabled"
    :required="required" @blur="
      (e) => {
        $emit('blur', e.detail);
      }
    " @change="changeVal" @input="
      (e) => {
        $emit('input', e.detail);
      }
    " @focus="
      (e) => {
        $emit('focus', e.detail);
      }
    " class="ui-input">
    <template #right-icon>
      <slot></slot>
    </template>
  </van-field>
</template>

<script>
export default {
  props: {
    value: {
      default: "",
    },
    placeholder: {
      type: String,
    },
    type: {
      type: String,
    },
    label: {
      type: String,
    },
    titlew: {
      type: String,
      default: "6.2em",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeVal(e) {
      this.$emit("update:value", e.detail);
    },
  },
  options: {
    styleIsolation: "shared",
    addGlobalClass: true,
  },
};
</script>

<style lang="scss">
.van-cell {
  padding-left: 0 !important;
  padding-right: 0 !important;
  &:after {
    left: 0 !important;
    right: 0 !important;
  }
}
.ui-input {
  width: 100%;
  .van-field {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .van-cell--required:before {
    left: -10rpx;
  }
}
</style>
