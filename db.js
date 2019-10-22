const mongoose = require('mongoose');
var moment =require( 'moment');
var exports;
mongoose.connect('mongodb+srv://mipod-test1:mipod-0521@mipod-db-u4ido.gcp.mongodb.net/mipod-ecpay?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var schema = mongoose.Schema;
var userSchema = new schema(
  {
    userID:      { type: String },
    email:     { type: String, unique: true },
    receive_account : {
      bank_code: { type: String, min:3 , max:3},
      account:   { type: String}
    },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
  },
  { collection: 'users' }
);
function getDate(){
  const timestamp = moment().format('YYYY/M/D hh:mm:ss');
  return timestamp;
}
var orderSchema = new schema(
  { 
    serial:       { type: String, unique: true  },
    orderUID:       { type: String, unique: true  },
    amount:       { type: Number },
    type:         { type: String },
    title:        { type: String },
    description:  { type: String },
    owner:        { type: String },
    create_at:    { type: String, default: getDate },
    update_at:    { type: String, default: getDate },
    status:       { type: Boolean, default: false },
    extra:        { type: JSON, default: {}}
  },
  { collection: 'orders' }
);
var order = mongoose.model('orders', orderSchema);
var user = mongoose.model('users', orderSchema);

exports.add_order = (amount,type,title,description,owner,extra) =>{
  if(!title&&owner){
    return false
  }
  orderSerial = createOrderSerial();
  var new_order = new order({
    serial: orderSerial,
    amount: amount||0,
    type: type||'all',
    title: title,
    description: description||'no description',
    owner: owner,
    create_at:   getDate(),
    update_at:   getDate(),
    extra: extra || {}
  }) ;
    new_order.save(function (err, docs) {
      if (err) return console.error(err);
      //docs.info();


    });
      return {serial:orderSerial};
}
exports.read_order = (serial,res,resErrorSolu,app_cb)=>{
  var _order=0;
  order.find({ serial: serial }, 'serial orderUID amount title description owner status create_at update_at',(err,data)=>{
    if(err) app_cb(_order,res,resErrorSolu);
    console.log(data);
    _order=data[0];
    cb(data);
  }).exec();
  function cb(data){
    console.log('fuck'+_order);
    //while(!_order==0);
    app_cb(_order,res,resErrorSolu);
        return _order;
  }
}
exports.pay = (serial,res,resErrorSolu,app_cb)=>{
  var _order=0;
  order.find({ serial: serial }, 'serial orderUID amount title description owner status create_at update_at',(err,data)=>{
    if(err) app_cb(_order,res,resErrorSolu);
    console.log(data);
    _order=data[0];
    if(_order.status) _order='error_linkExpired';
    cb(data);
  }).exec();
  function cb(data){
    console.log('fuck'+_order);
    //while(!_order==0);
    
    order.updateOne({serial:serial},{orderUID:createOrderUID()},(err,rawRes)=>{
      if(err) _order=undefined;
      app_cb(_order,res,resErrorSolu);
    });
    
        return _order;
  }
}
exports.update_order_status = (serial)=>{
  order.updateOne({serial:serial},{status:true},(err,rawRes)=>{
    if(err) return false;
  });
  return true;
}
exports.delete_order = (serial,userID)=>{
  if(await order.where({serial:serial}).exists()){
    if(await user.where({userID:userID}).exists()){
      if(await order.where({owner:userID}).exists()){
        var del_order= await order.where({serial:serial}).findOneAndRemove({serial:serial,owner:userID});
        if(del_order){
          return true;
        }else{
          return false;
        }

      }
    }
  }
}
exports.create_user = (serial,res,resErrorSolu,app_cb)=>{
   
}
exports.read_user = (serial,res,resErrorSolu,app_cb)=>{
  var _order=0;
  order.find({ serial: serial }, 'serial orderUID amount title description owner status create_at update_at',(err,data)=>{
    if(err) app_cb(_order,res,resErrorSolu);
    console.log(data);
    _order=data[0];
    cb(data);
  }).exec();
  function cb(data){
    console.log('fuck'+_order);
    //while(!_order==0);
    app_cb(_order,res,resErrorSolu);
        return _order;
  }
}
function createOrderSerial(){
  function makeid(length) {
     var result           = '';
     var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }
  var serial = 'mipodpay'+makeid(12);
  return  serial;
}
function createOrderUID(){
  function makeid(length) {
     var result           = '';
     var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }
  var serial = 'mipodL2P'+makeid(12);
  return  serial;
}
module.exports = exports ;