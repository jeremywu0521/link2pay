var exports;
var config = require('config');
//config.url = '../config/MipodSys_info';
//var MipodSys_version = config.get('MipodSys.system.version');
var MipodSys_version = 'beta0.1.1';
exports.services = (req,res,next) => {
  res.set{
    'x-powered-by': 'Mipod Studio Network Engineering Works',
    'MipodSys-ver': MipodSys_version||'beta0.1.1'
    'IRP-AAAAB3NzaC1yc2EAAAADAQABAAABAQCmY+AjtFnazyucxGIzwNuGIOdftoD/xfDysriD2+1Yc/Z8C18YXOouTL/KzaCuG7OEVjr4tH5LHOLSnpP+shD8Lq2R+VLUUGW/6b4MbTeZNJicQRAdeoaigKGgbz4tYiyo8tpPAmlYLm1g/FQApvlMtLTo8nB4ek3RM60gwW/NdGOWMDSqK7TmDd21PyCIYUiHvbYSGJ583naeuAZtbncz9wJH7J1P2yrPeOEgY1BzmMK1JL3kAeOq1wdpToov4OpZvLuVkQY8y1/SOwCb+2sQhy4PM0xr8dkL5h4awyk+71LH/r65YrBLqt10/u6h+0M8EnOefr3Bypo/dkWK27kf',

  }
  next();
}
exports.encryption = (req,res,next) => {
  res.set{
    
  }
  next();
}

module.exports = exports;
