<template>
  <div class="tongji">
    <div class="item">开票金额:{{ tongjixinxi.sumMoney }}元</div>
    <div class="item">开票数量:{{ tongjixinxi.sumNumber }}张</div>
  </div>
  <t-table
    :data="data"
    :columns="COLUMNS"
    vertical-align="top"
    :hover="true"
    :pagination="pagination"
    :loading="dataLoading"
    @change="rehandleChange"
  >
    <template #invoiceType="{ row }">
      <p v-if="[7, 26].includes(row.invoiceType)" style="color: red">
        {{ invoiceTypeCode[row.invoiceType] }}
      </p>
      <p v-if="[4, 28].includes(row.invoiceType)" style="color: blue">
        {{ invoiceTypeCode[row.invoiceType] }}
      </p>
    </template>
    <template #money="{ row }">
      <p>{{ row.money }}元</p>
    </template>
  </t-table>
</template>

<script lang="ts" setup>
import { ref, reactive, defineExpose, defineProps, computed, nextTick } from 'vue';
import { COLUMNS } from '../constants3';

import { invoiceTongji } from '@/api';

const data = ref([]);
const dataLoading = ref(false);
const pagination = ref({
  defaultPageSize: 10,
  total: 10,
  defaultCurrent: 1,
});

const tongjixinxi = ref({
  sumMoney: '',
  sumNumber: '',
});

const props = defineProps({
  type: {
    type: Number,
    default: 1,
  },
  formData: {
    type: Object,
  },
});

const invoiceTypeCode = reactive({
  4: '专票（纸票）',
  7: '普票（纸票）',
  26: '普票（电票）',
  28: '专票（电票）',
});

const reqUrl = computed(() => {
  let url = '';
  switch (props.type) {
    case 2:
      url = 'agent/api/site/site_day_red_invoice/page';
      break;
    case 3:
      url = 'agent/api/site/site_day_cancel_invoice/page';
      break;
    default:
      url = 'agent/api/site/site_day_invoice/page';
      break;
  }
  return url;
});

const getData = (search?: { [key: string]: any }) => {
  dataLoading.value = true;
  nextTick(async () => {
    try {
      const res: any = await invoiceTongji(reqUrl.value, {
        page: pagination.value.defaultCurrent,
        limit: pagination.value.defaultPageSize,
        searchModel: {
          id: '',
          ...search,
        },
      });

      if (res.code === 0) {
        data.value = res.data.list || [];
        pagination.value = {
          ...pagination.value,
          total: Number(res.msg) || 0,
        };
        tongjixinxi.value.sumMoney = res.data.sumMoney;
        tongjixinxi.value.sumNumber = res.data.sumNumber;
      }
    } catch (e) {
      console.log(e);
    } finally {
      dataLoading.value = false;
    }
  });
};

const rehandleChange = (curr) => {
  const { current, pageSize } = curr.pagination;

  pagination.value.defaultCurrent = current;
  pagination.value.defaultPageSize = pageSize;

  getData(props.formData);
};

defineExpose({
  getData,
  data,
  pagination,
});
</script>
<style lang="less">
.tongji {
  display: flex;
  .item {
    margin-right: 10px;
  }
}
</style>
