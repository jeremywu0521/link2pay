var moment =require( 'moment');
var	chalk = require('chalk');

var exports;

exports = (level, msg, data) => {
  const timestamp = moment().format('YYYY/M/D-hh:mm:ss');
  const prefix = `${timestamp} [${level}] ->`;
  console.log(prefix, msg || '', data || '');

};
exports.info = ( worker, msg, data) => {
	const level = chalk.cyan('info');
	log(level,(`   ${worker}:  ${msg}  `+ data|| ''));

}
exports.warning = ( worker, msg, data) =>{
	const level = chalk.magentaBright('warning');
	log(level,(`${worker}:  ${msg}  `+ data|| ''));

}
exports.console = ( worker, msg, data) => {
	const level = chalk.bold.redBright.bgMagenta.underline('console warning');
	log(level,(`###${worker}:  ${msg}  `+ data|| ''));

}
function log(level, msg){
	this.timestamp = moment().format('YYYY/M/D-hh:mm:ss');
	console.log('%s    %s',`${timestamp } [${level}] -> `,msg,''||'\n');

}
module.exports = exports;

/*
//-----Mipod Studio System dependency Library Package-----
//
//TODO:
//	United console.log format and Style;
//
//(C)Mipod Studio - Jeremy Wu
*/
