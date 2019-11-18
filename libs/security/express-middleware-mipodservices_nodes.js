var exports;
var config = require('config');
//config.url = '../config/MipodSys_info';
//var MipodSys_version = config.get('MipodSys.system.version');
var MipodSys_version = 'beta0.1.1';
exports.services = (req,res,next) => {
  res.set({
    'x-powered-by': 'Mipod Studio Network Engineering Works',
    'mipodsys-ver': MipodSys_version||'beta0.1.1',
    'mipodstudio_production':'link2pay_demo_forContest',
    'mipodstudio_sigen':'jeremywu20191118qsgkpdu9jsaqddokvqr4l5o3pwn0zgbu9kf280p4cgupkrx8numh22sh1jxhlyi6'
  });
  next();
}
exports.encryption = (req,res,next) => {
  //res.set{
    
  
  next();
}

module.exports = exports;
