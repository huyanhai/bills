<template>
  <card class="list-card-container">
    <t-row :gutter="24" style="margin-bottom: 20px">
      <t-col :span="24">
        <t-button theme="default" @click="$router.back()"> 返回列表 </t-button>
        <template v-if="!query.type">
          <t-button v-if="[4, 7].includes(pageData.invoiceTypeCode)" theme="primary" @click="dayin">
            打印发票
          </t-button>
          <t-button theme="danger" @click="chonghong"> 冲红 </t-button>
          <t-button v-if="[4, 7].includes(pageData.invoiceTypeCode)" theme="danger" @click="zuofei"> 作废 </t-button>
        </template>
      </t-col>
    </t-row>
    <div class="invoicMain1">
      <iframe id="printIframe" data-v-0e768284="" :src="src" width="100%" height="600"></iframe>
    </div>
  </card>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next';
import print from 'print-js';
import { invoiceDetails, invoiceCancel1, invoiceRed } from '@/api';
import Card from '@/components/card/index.vue';

const { query } = useRoute();
const router = useRouter();

const pageData: any = ref({});

const src = computed(() => {
  if (query.type) {
    return query.type === 'red' ? pageData.value.redPdfUrl : pageData.value.pdfUrl;
  }
  return pageData.value.pdfUrl;
});

const dayin = () => {
  print({
    printable: src.value, // 标签元素id
    type: 'pdf',
    header: '',
    targetStyles: ['*'],
  });
};

const chonghong = () => {
  const mydialog = DialogPlugin.confirm({
    body: '确定冲红',
    onConfirm: async () => {
      const data = await invoiceRed({
        invioiceId: (query as any).id,
      });
      if ((data as any).code === 0) {
        MessagePlugin.success('冲红成功');
        router.back();
      } else {
        MessagePlugin.error((data as any).msg);
      }
      mydialog.hide();
    },
  });
};

const zuofei = async () => {
  const mydialog = DialogPlugin.confirm({
    body: '确定作废',
    onConfirm: async () => {
      const data = await invoiceCancel1({
        invoiceId: (query as any).id,
      });
      if ((data as any).code === 0) {
        MessagePlugin.success('作废成功');
        router.back();
      } else {
        MessagePlugin.error((data as any).msg);
      }
      mydialog.hide();
    },
  });
};

const getInfo = async () => {
  const data = await invoiceDetails({
    id: (query as any).id,
  });
  pageData.value = data || {};
};

onMounted(() => {
  getInfo();
});
</script>
<style>
ul,
ul li {
  list-style: none;
  margin: 0;
  padding: 0;
}

label {
  color: #9c5223;
}

.invoicMain1 {
  width: 920px;
  margin: 0 auto;
  font-size: 14px;
  padding: 20px;
}
</style>
