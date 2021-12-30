import request from '@/utils/request';

export const login = (data: { phone: string; pass: string }) => {
  return request({
    url: 'agent/api/site/h5/login',
    method: 'post',
    data,
  });
};

export const invoiceInfo = (data: { page: number; limit: number; searchModel: any }) => {
  return request({
    url: 'agent/api/site/h5/invoice_info/page',
    method: 'post',
    data,
  });
};

export const invoiceDetails = (data: { id: string | number }) => {
  return request({
    url: 'agent/api/site/get/invoice_info',
    method: 'get',
    params: data,
  });
};

export const invoiceQuery = (data: { invoiceId: string | number }) => {
  return request({
    url: 'agent/api/site/query/site/invoice_type',
    method: 'get',
    params: data,
  });
};

export const goodsinfo = () => {
  return request({
    url: 'agent/api/site/get/goodsinfo',
    method: 'get',
  });
};

export const invoiceCancel = (data: { invioiceId: string }) => {
  return request({
    url: 'agent/api/site/cancel/invoice',
    method: 'get',
    params: data,
  });
};

export const invoiceTijiao = (data: {
  invoiceId: string;
  goodsId: string;
  price: number;
  number: number;
  invoiceTypeCode: number;
}) => {
  return request({
    url: 'agent/api/site/get/invoice',
    method: 'post',
    data,
  });
};

export const invoiceRed = (data: { invioiceId: string }) => {
  return request({
    url: 'agent/api/site/get/invoice/red',
    method: 'get',
    params: data,
  });
};

export const invoiceCancel1 = (data: { invoiceId: string }) => {
  return request({
    url: 'agent/api/site/get/invoice/cancel',
    method: 'get',
    params: data,
  });
};
