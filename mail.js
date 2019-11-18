var nodemailer = require('nodemailer');
var db = require('./db');
var mailTransport = nodemailer.createTransport({
    host: 'smtp.googlemail.com', // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
  auth: {
    user: 'mipodstudio@gmail.com',
    pass: 'mipod-0521'
  }
});

var exports;
exports.sendMail_paid = async (orderUID)=>{
    var orderInfo = await db.readOrder(orderUID);
    console.log(orderInfo.owner);
    var userInfo = await db.read_user(orderInfo.owner);
    var htmlContent ='<h1>Your Order - '+orderInfo.serial+' is got paid</h1>'+
                    '<h1>'+orderInfo.title+'</h1>'+
                    '<h3>Amount: '+orderInfo.amount+'NTD$</h3>';
                    
    console.log(htmlContent,userInfo.email);
    mailTransport.sendMail({
        from: 'link2pay <mipodstudio@gmail.com>',
        to: 'jeremywu0521@gmail.com',
        subject: 'Your Order - '+orderInfo.serial+' is got paid',
        html: htmlContent
      }, function(err){
        if(err) {
          console.log('Unable to send email: ' + err);
        }
      });

}