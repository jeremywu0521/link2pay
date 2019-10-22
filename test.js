const ecpay = require('./libs/ECPAY_Payment_node_js');
const ecpay_payment = ecpay;
const express = require('express');
var app = express();
var orderDetail = {
  serial: '1ipodpayu34rdbut8drq',
  amount: 100,
  title: 'test',
  description: 'drgmf',
  owner: 'jeremy',
  create_at: '2019/10/21 02:37:13',
  update_at: '2019/10/21 02:37:13' }
    ;
  let base_param = {
        MerchantTradeNo: orderDetail.serial.toString(), //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
        MerchantTradeDate: orderDetail.create_at.toString(), //ex: 2017/02/13 15:45:30
        TotalAmount: orderDetail.amount.toString(),
        TradeDesc: orderDetail.description||'',
        ItemName: orderDetail.title.toString(),
        ReturnURL: 'https://link2pay.mipodstudio.com/payment_ecpay_return',
        EncryptType:'1',
        // ChooseSubPayment: '',
        // OrderResultURL: 'http://192.168.0.1/payment_result',
        // NeedExtraPaidInfo: '1',
        // ClientBackURL: 'https://www.google.com',
        // ItemURL: 'http://item.test.tw',
        // Remark: '交易備註',
        // StoreID: '',
        // CustomField1: '',
        // CustomField2: '',
        // CustomField3: '',
        // CustomField4: ''
    };



app.get('/ecpay_test',(req,res)=>{
  let create = new ecpay_payment();
  let htm = create.payment_client.aio_check_out_all(parameternpms = base_param,invoice={});
  console.log(htm);
  res.send('\n'+htm.toString()+'\n');
  res.end()
})
app.listen(5487);
