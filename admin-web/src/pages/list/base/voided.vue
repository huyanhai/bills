<template>
  <div>
    <card class="list-card-container">
      <t-breadcrumb :max-item-width="'150'">
        <t-breadcrumbItem to="/">发票管理</t-breadcrumbItem>
        <t-breadcrumbItem>冲红发票管理</t-breadcrumbItem>
      </t-breadcrumb>
      <t-row style="margin: 20px 0">
        <t-col :span="24">
          <t-form layout="inline">
            <t-form-item label="发票类型" name="buyerInvoiceType">
              <t-select v-model="formData.invoiceTypeCode" class="demo-select-base" clearable>
                <t-option key="4" value="4" label="专票（纸票） "> </t-option>
                <t-option key="7" value="7" label="普票（纸票）"> </t-option>
                <t-option key="26" value="26" label="普票（电票）"> </t-option>
                <t-option key="28" value="28" label="专票（电票）"> </t-option>
              </t-select>
            </t-form-item>
            <t-form-item label="购方类型" name="buyerType">
              <t-select v-model="formData.buyerType" class="demo-select-base" clearable>
                <t-option key="1" value="1" label="企业 "> </t-option>
                <t-option key="1" value="2" label="个人 "> </t-option>
              </t-select>
            </t-form-item>
            <t-form-item label="购方抬头" name="buyerTitle">
              <t-input v-model="formData.buyerTitle" />
            </t-form-item>
            <t-form-item label="购方税号" name="buyerTaxNo">
              <t-input v-model="formData.buyerTaxNo" />
            </t-form-item>
            <t-form-item label="发票编号" name="invoiceNo">
              <t-input v-model="formData.invoiceNo" />
            </t-form-item>
            <t-form-item label="冲红发票编号" name="redInvoiceNo">
              <t-input v-model="formData.redInvoiceNo" />
            </t-form-item>
            <t-form-item label="发票状态" name="state">
              <t-select v-model="formData.state" class="demo-select-base" clearable>
                <t-option key="0" value="0" label="待确认"> </t-option>
                <t-option key="1" value="1" label="已确认"> </t-option>
                <t-option key="2" value="2" label="开票成功"> </t-option>
                <t-option key="3" value="3" label="已作废"> </t-option>
                <t-option key="4" value="4" label="已冲红"> </t-option>
                <t-option key="5" value="5" label="取消开票"> </t-option>
                <t-option key="6" value="7" label="验签中"> </t-option>
                <t-option key="6" value="7" label="红票验签中"> </t-option>
              </t-select>
            </t-form-item>
            <t-button @click="search">搜索</t-button>
          </t-form>
        </t-col>
      </t-row>
      <t-table
        :data="data"
        :columns="COLUMNS"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :loading="dataLoading"
        @change="rehandleChange"
      >
        <template #state="{ row }">
          <t-tag v-if="[0, 1].includes(row.state)" theme="primary" variant="light" size="small">
            {{ stateType[row.state] }}
          </t-tag>
          <t-tag v-if="[2].includes(row.state)" theme="success" variant="light" size="small">
            {{ stateType[row.state] }}
          </t-tag>
          <t-tag v-if="[3, 4].includes(row.state)" theme="warning" variant="light" size="small">
            {{ stateType[row.state] }}
          </t-tag>
          <t-tag v-if="[5, 6, 7].includes(row.state)" theme="danger" variant="light" size="small">
            {{ stateType[row.state] }}
          </t-tag>
        </template>
        <template #invoiceTypeCode="{ row }">
          <p v-if="[7, 26].includes(row.invoiceTypeCode)" style="color: red">
            {{ invoiceTypeCode[row.invoiceTypeCode] }}
          </p>
          <p v-if="[4, 28].includes(row.invoiceTypeCode)" style="color: blue">
            {{ invoiceTypeCode[row.invoiceTypeCode] }}
          </p>
        </template>
        <template #buyerType="{ row }">
          <p>{{ buyerType[row.buyerType] }}</p>
        </template>
        <template #op="slotProps">
          <t-button size="small" @click="showPdf(slotProps.row, 'pdf')">查看发票</t-button>
          <t-button v-if="slotProps.row.state !== 3" theme="danger" size="small" @click="showPdf(slotProps.row, 'red')">
            查看红票
          </t-button>
        </template>
      </t-table>
    </card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Card from '@/components/card/index.vue';
import { invoiceInfo } from '@/api';

import { COLUMNS } from './constants2';

const router = useRouter();
const stateType = reactive({
  0: '待确认',
  1: '已确认',
  2: '开票成功',
  3: '已作废',
  4: '已冲红',
  5: '取消开票',
  6: '验签中',
  7: '红票验签中',
});
const invoiceTypeCode = reactive({
  4: '专票（纸票）',
  7: '普票（纸票）',
  26: '普票（电票）',
  28: '专票（电票）',
});
const buyerType = reactive({
  2: '个人',
  1: '企业',
});

const formData: any = reactive({
  invoiceTypeCode: '',
  buyerType: '',
  buyerTitle: '',
  buyerTaxNo: '',
  invoiceNo: '',
  redInvoiceNo: '',
  state: '',
});

const data = ref([]);
const pagination = ref({
  defaultPageSize: 10,
  total: 100,
  defaultCurrent: 1,
});

const dataLoading = ref(false);

const pageType = computed(() => {
  const { name } = useRoute();
  switch (name) {
    case 'complete':
      return 1;
    case 'voided':
      return 2;
    default:
      return 0;
  }
});

const fetchData = async (search = {}) => {
  dataLoading.value = true;
  try {
    const res: any = await invoiceInfo({
      page: pagination.value.defaultCurrent,
      limit: pagination.value.defaultPageSize,
      searchModel: {
        stateSearch: pageType.value,
        ...search,
      },
    });

    if (res.code === 0) {
      data.value = res.data || [];

      pagination.value = {
        ...pagination.value,
        total: Number(res.msg) || 0,
      };
    }
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

const search = () => {
  fetchData(formData);
};

const rehandleChange = (curr) => {
  const { current, pageSize } = curr.pagination;

  pagination.value.defaultCurrent = current;
  pagination.value.defaultPageSize = pageSize;

  fetchData();
};

onMounted(() => {
  fetchData();
});

const showPdf = (item, type) => {
  router.push({
    path: '/dashboard/tick1',
    query: {
      id: item.id,
      type,
    },
  });
};
</script>
<style lang="less" scoped>
@import '@/style/variables';

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}

.left-operation-container {
  padding: 6px 0;
  margin-bottom: 16px;

  .selected-count {
    display: inline-block;
    margin-left: 8px;
    color: @text-color-secondary;
  }
}

.search-input {
  width: 360px;
}
</style>
