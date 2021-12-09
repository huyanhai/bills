<template>
  <view>
    <view @click="showPicker">
      <CInput
        :value.sync="value"
        :placeholder="placeholder"
        :label="label"
        :required="required"
        :disabled="true"
      />
    </view>
    <van-popup
      :show="show"
      custom-style="bottom:0;width:100%"
      position="bottom"
      :custom-class="customClass"
    >
      <van-picker
        :columns="provinceColumns"
        value-key="name"
        @confirm="confirm"
        @cancel="show = false"
        @change="pickerChange"
        show-toolbar
      />
    </van-popup>
  </view>
</template>

<script>
import CInput from './CInput.vue';
import { get, post } from '../../libs/request';
export default {
  props: {
    defaultVal: {
      type: String,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    customClass: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    CInput,
  },
  watch: {
    defaultVal: {
      handler(newVal) {
        this.value = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      show: false,
      value: '',
      provinceColumns: [
        {
          values: [],
        },
        {
          values: [],
        },
        {
          values: [],
        },
      ],
    };
  },
  methods: {
    async showPicker() {
      const result1 = await this.getProvince({});
      if (result1) {
        this.provinceColumns[0] = {
          values: result1,
        };
        const result2 = await this.getCity({ type: 'init', pid: result1[0].id });
        if (result2) {
          this.provinceColumns[1] = {
            values: result2,
          };
          const result3 = await this.getCounty({ type: 'init', cid: result2[0].id });
          this.provinceColumns[2] = {
            values: result3,
          };
        }
      }
      this.show = true;
    },
    pickerChange(e) {
      const { picker, index, value } = e.detail;
      if (index === 0) {
        this.getCity({ type: '', picker: picker, pid: value[index].id });
        picker.setColumnValues(2, []);
      }
      if (index === 1) {
        this.getCounty({ type: '', picker: picker, cid: value[index].id });
      }
    },
    async getProvince({ type = 'init' }) {
      const { data, code } = await post('p/area-province');
      if (code === 0) {
        return data;
      }
    },
    async getCity({ type = 'init', picker, pid }) {
      const { data, code } = await get('p/area-city', {
        pid: pid,
      });
      if (code === 0) {
        if (type === 'init') {
          return data;
        }
        picker.setColumnValues(1, data);
        if (data.length >= 1) {
          this.getCounty({ type: '', picker: picker, cid: data[0].id });
        }
      }
    },
    async getCounty({ type = 'init', picker, cid }) {
      const { data, code } = await get('p/area-county', {
        cid: cid,
      });
      if (code === 0) {
        if (type === 'init') {
          return data;
        }
        picker.setColumnValues(2, data);
      }
    },
    confirm(e) {
      const [one, two, three] = e.detail.value;
      if (one.id) {
        this.value = `${one.name}`;
      }
      if (two.id) {
        this.value = `${this.value}-${two.name}`;
      }
      if (three.id) {
        this.value = `${this.value}-${three.name}`;
      }
      this.$emit('pickerInfo', e.detail.value);
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
.van-field__label--disabled {
  color: #646566 !important;
}
.van-field__control--disabled {
  color: #323233 !important;
}
</style>
