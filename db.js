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
    userID:      { type: String ,unique: true },
    userProfile: {type:String,  default: ' ' },
    userName:   {type:String , default: ' ' },
    email:     { type: String},
    receive_account : {
      bank_code: { type: String},
      account:   { type: String}
    },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
  },{ collection: 'users' }
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
var user = mongoose.model('users', userSchema);

 exports.add_order = async (amount,type,title,description,owner,extra) =>{
  if(!title&&owner){
    return false
  }
  orderSerial = createOrderSerial();
  var new_order = new order({
    serial: orderSerial,
    orderUID: createOrderUID(),
    amount: amount||0,
    type: type||'all',
    title: title,
    description: description||'no description',
    owner: owner,
    create_at:   getDate(),
    update_at:   getDate(),
    extra: extra || {}
  }) ;
    var hi = await new_order.save(function (err, docs) {
      if (err) {
        console.log(err);
        return false;
      }
      //docs.info();

      return {serial:orderSerial};
    });
    return {serial:orderSerial};
}
exports.read_order = async (serial,res,resErrorSolu,app_cb)=>{
  var _order=0;
  await order.find({ serial: serial }, 'serial orderUID amount title description owner status create_at update_at',(err,data)=>{
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
exports.readOrder = async (orderUID)=>{
  var _order= await order.findOne({ orderUID: orderUID }, 'serial orderUID amount title description owner status create_at update_at',(err,data)=>{
    if(err) return false;
    console.log(data);
  }).exec();
  return _order;
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
exports.update_order_status = (orderUID)=>{
  order.updateOne({orderUID:orderUID},{status:true},(err,rawRes)=>{
    if(err) return false;
  });
  return true;
}
exports.delete_order = async (serial,userID)=>{
  console.log(await order.exists({serial:serial}));
  if(await order.exists({serial:serial})){
      if(await order.exists({owner:userID})){
        var del_order= await order.deleteOne({serial:serial,owner:userID});
        if(del_order){
          return true;
        }else{
          return false;
        }

      }
    
  }else{
    return false;
  }
}
exports.add_change_user =  async (userID,userName,receive_account,userProfile,email)=>{
  var isUserExists =   await user.where({userID:userID});
  console.log(isUserExists);
  console.log(await user.exists({userID:userID}));
  if(await user.exists({userID:userID})){
    var new_userInfo=0;
    
    var userInfo = user.findOne({userID:userID},(err,user_query)=>{
        if(err){
          console.log(err);return false;
        } 
        console.log(user_query);
    });
      console.log(new_userInfo);
      new_userInfo ={
        userID:userID||userInfo.userID,
        userName:userName||userInfo.userName,
        userProfile: userProfile|| userInfo.userProfile||' ',
        email:email|| userInfo.email||' ',
          receive_account : {
          bank_code: receive_account.bank_code|| userInfo.receive_account.bank_code,
          account:  receive_account.account|| userInfo.receive_account.account
        }
       };
      if(new_userInfo){
        await  user.updateOne({userID:userID},new_userInfo,(err,rawRes)=>{
          if(err) { console.log(err);return false;
          }
          //return true
        });
          return true;

      }else{
        return false;
      }

    
  }else{
    var new_user = new user({
      userID:userID,
      userProfile: userProfile,
      email:email,
        receive_account : {
        bank_code: receive_account.bank_code,
        account:  receive_account.account
      }
    });
    await new_user.save(function (err, docs) {
      if (err) {
        console.log(err);
        return false;
      }
      //docs.info();

      //return true;
    });
    return true;
  
  }

}
exports.read_user = async (userID)=>{
  var _user =  await user.findOne({userID:userID});
 //var _user = true;
  console.log(_user);console.log(userID);
  if(await user.exists({userID:userID})){
    var userData =await user.findOne({userID:userID.toString()},'userID userProfile email receive_account',(err,data)=>{
       if(err) {console.log(err);return false;}
       console.log(data);
      
    }).exec().then();
    var userJSON = {
      userID:userData.userID.toString(),
      userProfile: userData.userProfile,
      email:   userData.email ,
        receive_account : {
        bank_code: userData.receive_account.bank_code,
        account:   userData.receive_account.account
      }
    }; 
    return userJSON;
  }else{
    return false;
  }
}

exports.read_userOrders = async (owner)=>{
  var orders=0;
  await order.find({owner:owner},(err,data)=>{
    if(err){
      console.log(err);
      return false;
    } 
    console.log(data);
    if(data){
      orders=data;
      return data;
    }else{
      orders=[];
      return data;
    }

  });
  if(orders){
    return orders;
  }else{
    return false;
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
