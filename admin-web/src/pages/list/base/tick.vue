<template>
  <card class="list-card-container">
    <t-row :gutter="24" style="margin-bottom: 20px">
      <t-col :span="24">
        <t-button theme="default" @click="$router.back()"> 返回列表 </t-button>
        <t-button theme="primary" @click="tijiao"> 开票 </t-button>
        <t-button theme="danger" @click="cancel"> 取消开票 </t-button>
      </t-col>
    </t-row>
    <div class="invoicMain">
      <!-- head start -->
      <div class="invoiceHeader">
        <div class="invoiceHeader-left">
          <ul class="headerLeft">
            <li>
              <!-- <img src="./qrcode.png" alt="" /> -->
            </li>
            <li>
              <label>机器编号：</label><span>{{ pageData.machineCode }}</span>
            </li>
          </ul>
          <div class="headerMiddle">
            <h1>
              <t-select v-model="inputData.invoiceTypeCode" placeholder="请选择开具发票类型">
                <t-option
                  v-for="item in invoiceList"
                  :key="item.invoiceTypeCode"
                  :value="item.invoiceTypeCode"
                  :label="item.invoiceTypeName"
                ></t-option>
              </t-select>
            </h1>
            <div class="line"></div>
          </div>
        </div>

        <ul class="headerRight">
          <!-- <li><label> 发票代码： </label><span>111111</span></li>
          <li><label> 发票号码： </label><span>111111</span></li> -->
          <li>
            <label> 开票日期： </label><span>{{ day }}</span>
          </li>
          <!-- <li><label> 校&nbsp;&nbsp;验&nbsp;&nbsp;码： </label><span>11111 22222 33333 44444</span></li> -->
        </ul>
      </div>
      <!-- head end -->
      <!-- invoice body start -->
      <div class="invoiceBody">
        <div class="userInfo">
          <div class="buy">购买方</div>
          <ul>
            <li>
              <label>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</label
              ><span>{{ pageData.buyerTitle }}</span>
            </li>
            <li>
              <label>纳税人识别号：</label><span>{{ pageData.sellerTaxNo }}</span>
            </li>
            <li>
              <label>地址、&nbsp;&nbsp;&nbsp;电话：</label
              ><span>{{ pageData.sellerAddress }}/{{ pageData.sellerPhone }}</span>
            </li>
            <li>
              <label>开户行及账号：</label><span>{{ pageData.buyerBank }}/{{ pageData.buyerAccount }}</span>
            </li>
          </ul>
          <div class="password">密码区</div>
          <div class="pwdInfo">(加密区)</div>
        </div>
        <div>
          <table class="GoodsTable" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width: 24%">货物或应税劳务、服务名称</td>
              <td style="width: 10%">规格型号</td>
              <td style="width: 7%">单位</td>
              <td style="width: 10%">数量</td>
              <td style="width: 10%">单价</td>
              <td style="width: 16%">金额</td>
              <td style="width: 7%">税率</td>
              <td style="width: 16%; border-right: none">税额</td>
            </tr>
            <tr class="invoice-list">
              <td>
                <t-select v-model="inputData.goodsId" size="small" @change="changeGoods">
                  <t-option
                    v-for="item in goodsinfoList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.goods_name"
                  ></t-option>
                </t-select>
              </td>
              <td></td>
              <td>
                <input v-model="inputData.danwei" style="width: 50px" @focus="checkInput('danwei')" />
              </td>
              <td>
                <t-input-number v-model="inputData.number" size="small" :min="1" />
              </td>
              <td>
                {{ inputData.price }}
              </td>
              <td>{{ jine }}</td>
              <td>{{ inputData.tax_rate }}</td>
              <td>{{ suie }}</td>
            </tr>

            <tr class="total">
              <td>合计</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="GoodsTotal">
              <td>价税合计(大写)</td>
              <td colspan="7">
                <div style="width: 100%; display: flex">
                  <div type="text" style="width: 60%; text-align: left">{{ cnJine }}</div>
                  <div type="text" style="width: 30%">
                    (小写)
                    <input
                      v-model="inputData.xiaoxie"
                      style="width: 50px"
                      @input="checkNum1('xiaoxie')"
                      @focus="checkInput('xiaoxie')"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <div class="userInfo">
            <div class="buy">销售方</div>
            <ul>
              <li>
                <label>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</label
                ><span>{{ pageData.sellerTitle }}</span>
              </li>
              <li>
                <label>纳税人识别号：</label><span>{{ pageData.sellerTaxNo }}</span>
              </li>
              <li>
                <label>地址、&nbsp;&nbsp;&nbsp;电话：</label
                ><span>{{ pageData.sellerAddress }}/{{ pageData.sellerPhone }}</span>
              </li>
              <li>
                <label>开户行及账号：</label><span>{{ pageData.sellerBank }}/{{ pageData.sellerAccount }}</span>
              </li>
            </ul>
            <div class="password">备注</div>
            <div class="pwdInfo">{{ pageData.remarks }}</div>
          </div>
        </div>
      </div>
      <!-- invoice body start -->
      <ul class="invoicetFooter">
        <li>
          <label>收款人：</label>
        </li>
        <li>
          <label>复核：</label>
        </li>
        <li>
          <label>开票人：</label>
        </li>
        <li>
          <label>销售方：（章）</label>
        </li>
      </ul>
    </div>
  </card>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next';
import nzh from 'nzh/cn';
import dayjs from 'dayjs';
import { invoiceDetails, invoiceQuery, goodsinfo, invoiceCancel, invoiceTijiao } from '@/api';
import Card from '@/components/card/index.vue';

const pageData: any = ref({});
const invoiceList = ref([]);
const goodsinfoList = ref([]);
const inputData: any = reactive({
  invoiceTypeCode: null,
  goodsId: null,
  danwei: null,
  number: 1,
  price: null,
  xiaoxie: 0,
});

const { query } = useRoute();
const router = useRouter();

const day = dayjs().format('YYYY-MM-DD');

const getInfo = async () => {
  const { data } = await invoiceDetails({
    id: (query as any).id,
  });
  pageData.value = data || {};
  inputData.xiaoxie = data.money;
};

const getinvoiceQuery = async () => {
  const { data } = await invoiceQuery({
    invoiceId: (query as any).id,
  });
  invoiceList.value = data;
  if (data.length > 0) {
    inputData.invoiceTypeCode = data[0].invoiceTypeCode;
  }
};

const changeGoods = (e) => {
  for (const item of goodsinfoList.value) {
    if (item.id === e) {
      inputData.tax_rate = item.tax_rate;
    }
  }
};
const goodsinfoQuery = async () => {
  const { data } = await goodsinfo();
  goodsinfoList.value = data;
  if (data.length > 0) {
    inputData.goodsId = data[0].id;
    changeGoods(data[0].id);
  }
};

const checkInput = (type: string) => {
  if (!inputData.goodsId) {
    inputData[type] = null;
    MessagePlugin.error('请选择类型');
  }
};

// const checkNum = (type: string) => {
//   if (!/^\d+$/.test(inputData[type])) {
//     inputData[type] = inputData[type].substring(0, inputData[type].length - 1);
//   }
// };

const checkNum1 = (type: string) => {
  if (
    (!/^(([1-9]\d*)|\d)(\.\d{1,10})?$/.test(inputData[type]) && !inputData[type].endsWith('.')) ||
    inputData[type].split('.').length > 2
  ) {
    inputData[type] = inputData[type].substring(0, inputData[type].length - 1);
  }
};

// 金额
const jine: any = computed(() => {
  if (!inputData.tax_rate) {
    return 0;
  }
  return (Number(inputData.xiaoxie) / (1 + Number(inputData.tax_rate.replace('%', '') / 100))).toFixed(2);
});

inputData.price = computed(() => {
  if (!inputData.number || !jine.value) {
    return 0;
  }
  return Number(jine.value / inputData.number).toFixed(2);
});

const suie: any = computed(() => {
  if (!inputData.xiaoxie || !jine.value) {
    return 0;
  }
  return (inputData.xiaoxie - jine.value).toFixed(2);
});

const cnJine: any = computed(() => {
  if (!inputData.xiaoxie) {
    return '';
  }
  return nzh.toMoney(inputData.xiaoxie || 0, {
    outSymbol: false,
  });
});

const cancel = async () => {
  const mydialog = DialogPlugin.confirm({
    body: '确定取消开票',
    onConfirm: async () => {
      const data = await invoiceCancel({
        invioiceId: (query as any).id,
      });

      if ((data as any).code === 0) {
        MessagePlugin.success('取消成功');
        router.back();
      } else {
        MessagePlugin.error((data as any).msg);
      }
      mydialog.hide();
    },
  });
};

const tijiao = async () => {
  if (!inputData.invoiceTypeCode) {
    return MessagePlugin.error('请选择开票类型');
  }
  if (!inputData.goodsId) {
    return MessagePlugin.error('请选择货物或应税劳务、服务名称！');
  }
  if (!inputData.xiaoxie) {
    return MessagePlugin.error('请填写正确的金额！');
  }
  if (!inputData.number) {
    return MessagePlugin.error('请填写正确的数量！');
  }
  const mydialog = DialogPlugin.confirm({
    body: '确定开票',
    onConfirm: async () => {
      const data = await invoiceTijiao({
        invoiceId: (query as any).id,
        invoiceTypeCode: inputData.invoiceTypeCode,
        goodsId: inputData.goodsId,
        money: Number(inputData.xiaoxie),
        number: Number(inputData.number),
        unit: inputData.danwei,
      });
      if (data.code === 0) {
        MessagePlugin.success('开票成功');
        router.back();
      } else {
        MessagePlugin.error((data as any).msg);
      }
      mydialog.hide();
    },
  });
};

onMounted(() => {
  getInfo();
  getinvoiceQuery();
  goodsinfoQuery();
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

.invoicMain {
  width: 920px;
  margin: 0 auto;
  font-size: 14px;
  color: #000;
  padding: 20px;
  border: 3px solid #9c5223;
}

.invoiceHeader {
  height: 126px;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}

.headerLeft li:nth-child(1) {
  text-indent: 1em;
}

.headerLeft li img {
  width: 105px;
  height: 105px;
}

.headerMiddle h1 {
  font-size: 32px;
  color: #9c5223;
  font-family: 'kaiti';
  margin: 5px 12px;
}

.line {
  height: 2px;
  border-top: #9c5223 1px solid;
  border-bottom: #9c5223 1px solid;
}

.headerRight li {
  line-height: 24px;
}

.invoiceBody {
  border: 1px solid #9c5223;
}

.userInfo {
  width: 100%;
  display: flex;
  align-items: center;
  height: 96px;
  border-bottom: 1px solid #9c5223;
}

.userInfo ul {
  width: 50%;
  margin: 0 5px;
  padding: 0;
}

.userInfo ul li {
  line-height: 24px;
}

.buy {
  width: 30px;
  border-right: 1px solid #9c5223;
  padding: 0 10px;
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  color: #9c5223;
}

.password {
  width: 30px;
  padding: 0 10px;
  border-right: 1px solid #9c5223;
  border-left: 1px solid #9c5223;
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  color: #9c5223;
}

.pwdInfo {
  flex: 1;
  padding-left: 5px;
}

.goodsInfo {
  height: 210px;
  margin: 0;
  padding: 0;
}

.goodsInfo li {
  display: flex;
  color: #9c5223;
  text-align: center;
}

.name {
  width: 260px;
  border-right: 1px solid #9c5223;
}

.spec {
  width: 140px;
  border-right: 1px solid #9c5223;
}

.qty {
  width: 108px;
  border-right: 1px solid #9c5223;
}

.unit,
.taxRate {
  width: 65px;
  border-right: 1px solid #9c5223;
}

.qty,
.price {
  width: 160px;
  border-right: 1px solid #9c5223;
}

.money {
  flex: 1;
  border-right: 1px solid #9c5223;
}

.taxAmount {
  flex: 1;
}

.GoodsTable {
  height: 210px;
  width: 100%;
  border-collapse: collapse;
}

.GoodsTable .invoice-list {
  /* height: 24px; */
}

.GoodsTable td {
  border-right: 1px solid #9c5223;
  color: #9c5223;
}

.GoodsTable tr:nth-child(1),
.GoodsTable tr:nth-last-child(2) {
  height: 24px;
}

.GoodsTable tr:nth-last-child(1) {
  height: 34px;
}

.GoodsTable tr:nth-child(1) td {
  text-align: center;
}

.GoodsTotal {
  border-top: 1px solid #9c5223;
  border-bottom: 1px solid #9c5223;
}

.total td:nth-child(1) {
  text-align: center;
}

.invoicetFooter {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.invoicetFooter li {
  width: 25%;
}
.invoiceHeader-left {
  width: 67%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.headerRight {
  margin-left: 28px;
}
.headerMiddle {
  margin-right: 15px;
}
td {
  text-align: center;
}
</style>
