
const ecpay = require('./libs/ECPAY_Payment_node_js');
const ecpay_payment = ecpay;
var db = require('./db');
var exports;
exports.ecpay_all = (orderDetail,orderSerial,res)=>{
  if(!(orderDetail.orderUID&&orderDetail.create_at&&orderDetail.amount&&orderDetail.title)) return false;
  if(orderDetail){
    if(orderDetail.amount==0) return false;
    let base_param = {
        MerchantTradeNo: orderDetail.orderUID.toString(), //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
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
    let create = new ecpay_payment();
    let htm = create.payment_client.aio_check_out_all(parameternpms = base_param);
    console.log(htm);
    res.send(htm);
    res.end();
    return { html:htm , orderSerial:orderSerial}
  }else{
    return false;
  }
}
module.exports = exports;
