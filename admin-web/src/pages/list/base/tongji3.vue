<template>
  <div>
    <card class="list-card-container">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-breadcrumb :max-item-width="'150'">
            <t-breadcrumbItem to="/">发票管理</t-breadcrumbItem>
            <t-breadcrumbItem>冲红统计</t-breadcrumbItem>
          </t-breadcrumb>
        </div>
      </t-row>
      <t-row style="margin-bottom: 20px">
        <t-col :span="24">
          <t-form layout="inline">
            <t-form-item label="发票类型" name="buyerInvoiceType">
              <t-select v-model="formData.invoiceType" class="demo-select-base" clearable>
                <t-option key="4" value="4" label="专票（纸票） "> </t-option>
                <t-option key="7" value="7" label="普票（纸票）"> </t-option>
                <t-option key="26" value="26" label="普票（电票）"> </t-option>
                <t-option key="28" value="28" label="专票（电票）"> </t-option>
              </t-select>
            </t-form-item>
            <t-form-item label="开始时间" name="beginDate">
              <t-date-picker v-model="formData.beginDate" theme="primary" mode="date" clearable />
            </t-form-item>
            <t-form-item label="结束时间" name="endDate">
              <t-date-picker v-model="formData.endDate" theme="primary" mode="date" clearable />
            </t-form-item>
            <t-button @click="search">搜索</t-button>
          </t-form>
        </t-col>
      </t-row>
      <invoice ref="invoiceCom" :type="tabItem" />
    </card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import Card from '@/components/card/index.vue';
import invoice from './components/invoice.vue';

const tabItem = ref(3);
const formData: {
  invoiceType: string;
  beginDate?: string;
  endDate?: string;
} = reactive({
  invoiceType: '',
});
const invoiceCom = ref(null);

const search = () => {
  if (formData.beginDate || formData.endDate) {
    if (!formData.beginDate || !formData.endDate) {
      return MessagePlugin.error('开始或结束时间为空');
    }
  }
  invoiceCom.value.pagination.defaultPageSize = 1;
  invoiceCom.value.getData(formData);
};

watch(tabItem, () => {
  invoiceCom.value.getData({});
});

onMounted(() => {
  invoiceCom.value.getData({});
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
