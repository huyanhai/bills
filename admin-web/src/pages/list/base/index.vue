<template>
  <div>
    <card class="list-card-container">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-breadcrumb :max-item-width="'150'">
            <t-breadcrumbItem to="/">发票管理</t-breadcrumbItem>
            <t-breadcrumbItem>待开票管理</t-breadcrumbItem>
          </t-breadcrumb>
        </div>
      </t-row>
      <t-row style="margin-bottom: 20px">
        <t-col :span="24">
          <t-form layout="inline">
            <t-form-item label="发票类型" name="buyerInvoiceType">
              <t-select v-model="formData.buyerInvoiceType" class="demo-select-base" clearable>
                <t-option key="1" value="1" label="专票 "> </t-option>
                <t-option key="1" value="2" label="普票 "> </t-option>
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
            <t-button @click="search">搜索</t-button>
          </t-form>
        </t-col>
      </t-row>
      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        @change="rehandleChange"
      >
        <template #buyerInvoiceType="{ row }" mplate>
          <p v-if="row.buyerInvoiceType === 1" style="color: red">{{ buyerInvoiceType[row.buyerInvoiceType] }}</p>
          <p v-if="row.buyerInvoiceType === 2" style="color: blue">{{ buyerInvoiceType[row.buyerInvoiceType] }}</p>
        </template>
        <template #buyerType="{ row }">
          <p v-if="row.buyerType === 2" style="color: red">{{ buyerType[row.buyerType] }}</p>
          <p v-if="row.buyerType === 1" style="color: blue">{{ buyerType[row.buyerType] }}</p>
        </template>
        <template #state="{ row }" mplate>
          <t-tag v-if="[0, 1].includes(row.state)" theme="primary" variant="light" size="small">
            {{ state[row.state] }}
          </t-tag>
          <t-tag v-if="[1, 2].includes(row.state)" theme="success" variant="light" size="small">
            {{ state[row.state] }}
          </t-tag>
          <t-tag v-if="[3, 4].includes(row.state)" theme="warning" variant="light" size="small">
            {{ state[row.state] }}
          </t-tag>
          <t-tag v-if="[5, 6, 7].includes(row.state)" theme="danger" variant="light" size="small">
            {{ state[row.state] }}
          </t-tag>
        </template>
        <template #op="slotProps">
          <t-button size="small" @click="edit(slotProps.row)">发票操作</t-button>
        </template>
      </t-table>
    </card>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { CONTRACT_TYPES } from '@/constants';
import Card from '@/components/card/index.vue';
import { invoiceInfo } from '@/api';

import { COLUMNS } from './constants';

export default defineComponent({
  name: 'ListBaseCard',
  components: {
    Card,
  },
  setup() {
    const state = reactive({
      0: '待确认',
      1: '已确认',
      2: '开票成功',
      3: '已作废',
      4: '已冲红',
      5: '取消开票',
      6: '验签中',
      7: '红票验签中',
    });
    const buyerInvoiceType = reactive({
      1: '专票',
      2: '普票',
    });
    const buyerType = reactive({
      2: '个人',
      1: '企业',
    });
    const data = ref([]);
    const pagination = ref({
      defaultPageSize: 10,
      total: 100,
      defaultCurrent: 1,
    });

    const formData: any = reactive({
      buyerInvoiceType: '',
      buyerType: '',
      buyerTitle: '',
      buyerTaxNo: '',
    });

    const router = useRouter();

    const searchValue = ref('');

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

    const edit = (item) => {
      router.push({
        path: '/dashboard/tick',
        query: {
          id: item.id,
        },
      });
    };

    onMounted(() => {
      fetchData();
    });

    const selectedRowKeys = ref([1, 2]);

    return {
      CONTRACT_TYPES,
      COLUMNS,
      data,
      searchValue,
      dataLoading,
      pagination,
      rowKey: 'index',
      selectedRowKeys,
      state,
      buyerInvoiceType,
      rehandleChange,
      edit,
      buyerType,
      formData,
      search,
    };
  },
  methods: {},
});
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
