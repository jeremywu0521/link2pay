const express = require('express');
var app = express();
const db = require('./db');
const money = require('./money');
const path = require('path');
var bodyParser = require('body-parser');
var mail = require('./mail');
const mipodstudio_middleware_express = require('./libs/security/express-middleware-mipodservices_nodes');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(mipodstudio_middleware_express.services);
app.use('/:orderSerial',async (req,res,next)=>{     //ok
    if(!(req.params.orderSerial.indexOf('mipodpay')==-1)){
        function db_callback(data,res,resErrorSolu){
            if(data){
                var cookie_setting= {
                    //domain:'link2pay.mipodstudio.com',
                    //expire:'',
                    maxAge:10000
                }
                res.cookie('amount',data.amount,cookie_setting);
                res.cookie('title',data.title,cookie_setting);
                res.cookie('description',data.description,cookie_setting);
                res.cookie('fb_profile',data.owner,cookie_setting);
                res.cookie('status',data.status,cookie_setting);
                res.cookie('orderSerial',data.serial,cookie_setting);
                resSendFile('/www/payment.html',res);
               // res.end();
            }else{

            resErrorSolu('url_error',res);
            }
        }
        db.read_order(req.params.orderSerial,res,resErrorSolu,db_callback);
    }else{
        next();
    }
});
app.use('/payment/:orderSerial',(req,res)=>{        //ok
    if(req.params.orderSerial){
        function db_callback(data,res,resErrorSolu){
            if(!(!data||data=='error_linkExpired')){
                if(money.ecpay_all(data,req.params.orderSerial,res)){

                }else{
                    resErrorSolu('payment_error',res);
                }
            }else{
                resErrorSolu('payment_error',res);
            }
        }
        db.pay(req.params.orderSerial,res,resErrorSolu,db_callback);

    }else{
        resErrorSolu('payment_error',res);
    }
});
app.post('/create',async (req,res)=>{       //ok
    console.log(req.body.title,req.body.owner,req.body.amount);
    if(req.body.title&&req.body.owner&&req.body.amount){
        var add_order = await db.add_order(req.body.amount,req.body.type||'',req.body.title,req.body.description||'',req.body.owner,req.body.extra||{});
        if(add_order){
            console.log(add_order);
            res.send(JSON.stringify({status:'success',serial:add_order.serial}));
        }else{
            res.send(JSON.stringify({status:'failed',msg:'db_error'}));
        }
    }else{
        res.send(JSON.stringify({status:'failed',msg:'missed_required_value'}));
    }

});
app.post('/delete',async (req,res)=>{       //ok
    
    var _delete = await db.delete_order(req.body.serial,req.body.owner);
    if(_delete){
        res.send(JSON.stringify({status:'success'}));
    }else{
        res.send(JSON.stringify({status:'failed'}))
    }

});
app.post('/user',async (req,res)=>{
    var userInfo = await db.read_user(req.body.userID);
    console.log('user',userInfo);
    if(userInfo){
        userInfo.status = 'success';
        var userOrders=await db.read_userOrders(req.body.userID);
        console.log(userOrders);
        if(userOrders||userOrders==[]){
            userInfo.orders =  userOrders;
            console.log(userInfo);
            res.send(JSON.stringify(userInfo));
        }else{
             res.send(JSON.stringify({status:'failed'}));
        }
       
    }else{
        res.send(JSON.stringify({status:'failed'}));
    }
});
app.post('/add_change_user',async (req,res)=>{ //req = JSON.parse(req);
  console.log(req.body.userID,req.body.userName,{bank_code:req.body.receive_account_bank_code,account:req.body.receive_account},req.body.userProfile,req.body.email);
    var _add_user = await db.add_change_user(req.body.userID,req.body.userName,{bank_code:req.body.receive_account_bank_code,account:req.body.receive_account},req.body.userProfile,req.body.email);
    console.log('damn',_add_user);
    if(_add_user){
        res.send(JSON.stringify({status:'success'}));
    }else{
        res.send(JSON.stringify({status:'failed'}))
    }
});
app.post('/payment_ecpay_return',(req,res)=>{
    if(db.update_order_status(req.body.MerchantTradeNo)){
        if(req.body.RtnCode==1||'1'){
            res.send('1|OK');
            res.end();
            mail.sendMail_paid(req.body.MerchantTradeNo);
        }else{
            res.send(' ');
            res.end();
        }

    }else{
        res.send(' ');
        res.end();
    }

});
app.post('/payment_ecpay_result');
app.use('/',express.static('./www/'));

app.listen(5487);
function resSendFile(dir,res){
    var options = {
        root: __dirname + '/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };

      var fileName = dir;
      res.sendFile(fileName, options, function (err) {
        if (err) {
         // next(err);
         console.log(err);
        } else {
          console.log('Sent:', fileName);
        }
      });
}
function resErrorSolu(stats,res){
    switch(stats){
        case 'payment_error':
            resSendFile('./www/payment_error.html',res);
        break;
        case 'payment_error_':
            resSendFile('./www/payment_error.html',res);
        break;
        case 'url_error':
            resSendFile('./www/url_error.html',res);
        break;
        default:
            resSendFile('./www/error.html',res);

    }
}
