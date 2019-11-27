/**
 * An example of how you can send embeds
 */
 // over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
//Trading Group Payment Sys
// Extract the required classes from the discord.js module
const { Client, RichEmbed } = require('discord.js');
// Create an instance of a Discord client
const client = new Client();
var db = require('./db');
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('dc_bot standby');
});

client.on('message',async message => {
  var input = message.content.split(' ');			//[Array]  spilt by Spaces
  //console.log(message.author);
  console.log(message.author.id,message.author.username,input[2],input[3],input[4]);
	if(input[0] === '!link2pay') {
		if(input[1] === 'create'){			/// !link2pay create title amount title
			var  user= await db.read_user(message.author.id);
			if(user){
				DC_cb_create(message,input);
            }else{
				DC_resultError_unreg(message,'');
			}
		}else if(input[1] === 'register'){		/// !link2pay register email bank_code account
            var  user = await db.read_user(message.author.id);
            console.log(message.author.id,message.author.username,input[2],input[3],input[4]);
			if(!user){
                if(input[2]&&input[3]&&input[4]){
                    var receive_account={
                        bank_code:input[3],
                        account:input[4]
                    };
                    var add_change_user =await db.add_change_user(message.author.id,message.author.username,receive_account,'',input[2]);
                    if(add_change_user){
                        DC_result_reg(message,input);
                    }else{
                        DC_resultError_regError(message,'db_err');
                    }
                }else{
                    DC_resultError_regError(message,'miss required value');
                }
            }else{
                DC_resultError_reg(message,'');     //err - registed
			}
			
			}else if(input[1] === 'change'){
				DC_cb_change(message,input);
			}else if(input[1] === 'delete'){
				var  user = await db.read_user(message.author.id);
				if(user){
					DC_cb_delete(message,input);
                }else{
					DC_resultError('You haven\'t register yet ');
				}
			}else if(input[1] === 'list'){
                DC_cb_list(message);
			}else{
          var embed = {embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title:'  link2pay payment Service' ,
            url: 'https://link2pay.mipodstudio.com/',
            description: 'command to use',
            fields: [
              {
                name: 'Registration',
                value: "using **__!link2pay register [Email][Bank_code][account]__** to registration"
              },
              {
                name: 'Change user info',
                value: "using **__!link2pay change [Email][Bank_code][account]__** to change user info"
              },
              {
                name: 'Create Link',
                value: "using **__!link2pay create [title][amount][description]__** to create your order link"
              },
              {
                name: 'Delete Link',
                value: "using **__!link2pay delete [order unique serial]__** to delete your order link"
              },
              {
                name: 'View all links status',
                value: "using **__!link2pay list__** to view my links status"
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "©MipodStudio - link2pay Service for contest demo only"
            }
          }
        };
        message.channel.send(embed);

      }
		}
	});
client.login('NjQ4ODc2MTQ1NDA3OTUwODU4.Xd0nJQ.h_vE6bGbK8uphP3Qk8BtQ2DtL_c');
async function DC_cb_create(message,input){
    var     description = input[4],
          amount      = input[3],
          title       = input[2],
          owner       = message.author.id;
   
	var DC_order = await db.add_order(amount,'',title,description,owner,'');
	if(DC_order){
		 DC_resultEmbed(message,owner,title,amount,description,DC_order.serial);
		
	}else{
		DC_resultError('db error');
	}
}
async function DC_cb_delete(message,input){
                    var serial ;
				(input[2]+'/').split('/').forEach(function(data){
					if(data.indexOf('mipodpay')!=-1){
						serial = data;
					}
                });
                console.log(serial);
				if(!serial){
                    serial=input[2];
                    }
				var _del = await db.delete_order(serial,message.author.id);
				if(_del){
                    DC_result_del(message,input);
				}else{
                    DC_resultError_del(message,'link not exist');
				}
}
async function DC_cb_change(message,input){
    if(input[2]&&input[3]&&input[4]){
                var receive_account={
                    bank_code:input[3],
                    account:input[4]
                };
                var add_change_user =await db.add_change_user(message.author.id,message.author.username,receive_account,'',input[2]);
			if(add_change_user){
                DC_result_reg(message,input);
			}else{
				DC_resultError_regError(message,'db_err');
            }
        }DC_resultError_regError(message,'miss required value');
}
async function DC_cb_list(message,input){
   
    var userInfo = await db.read_user(message.author.id);
    console.log('user',userInfo);
    if(userInfo){
        userInfo.status = 'success';
        var userOrders=await db.read_userOrders(message.author.id);
        console.log(userOrders);
        if(userOrders||userOrders==[]){
            userInfo.orders =  userOrders;
            console.log(userInfo);
            if(Array.isArray(userInfo.orders)){
                if(userInfo.orders.length!=0){
                        var order_fields = [];
                        userInfo.orders.forEach((order)=>{
                            var status;
                            if(order.status){
                                status='paid';
                            }else{
                                status='unpaid'
                            }
                            order_fields.push({
                                    name: status,
                                    value: order.title + '    ' + order.amount+'$.NTD' + '    '+ order.description
                                });
                        });
                        var embed = {embed: {
                            color: 3447003,
                            author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                            },
                            title:'list      '+'- link2pay payment Service' ,
                            url: 'https://link2pay.mipodstudio.com/',
                            description: 'all orders',
                            fields: order_fields
                            ,
                            timestamp: new Date(),
                            footer: {
                            icon_url: client.user.avatarURL,
                            text: "©MipodStudio"
                            }
                        }
                        };
                        message.channel.send(embed);
                    }else{
                        DC_resultError_noorder(message,'no order');
                    }
                }
            }else if(!userInfo.orders){
                DC_resultError_noorder(message,'no order');
            }
        }else{
            DC_resultError_noorder(message,'db_err');
          
        }
       




}
function DC_resultError_unreg(message,err_msg){
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title:' Failed' + ' - link2pay payment Service' ,
        url: 'https://link2pay.mipodstudio.com/',
        description: err_msg,
        fields: [
          {
            name: 'You havn\'t register yet',
            value: "using **__!link2pay register [Email][Bank_code][account]__** to registration"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©MipodStudio - link2pay Service for contest demo only"
        }
      }
    };
      message.channel.send(embed);
}
function DC_resultError(message,err_msg){
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title:' Failed' + ' - link2pay payment Service' ,
        url: 'https://link2pay.mipodstudio.com/',
        description: err_msg,
        fields: [
          {
            name: 'error',
            value: "using **__!link2pay register [Email][Bank_code][account]__** try again"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©MipodStudio - link2pay Service for contest demo only"
        }
      }
    };
      message.channel.send(embed);
}
function DC_resultError_noorder(message,err_msg){
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title:'list' + ' - link2pay payment Service' ,
        url: 'https://link2pay.mipodstudio.com/',
        description: err_msg,
        fields: [
          {
            name: 'You havn\'t created any link yet',
            value: "using **__!link2pay create [title][amount][description] __** to create your first order link"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©MipodStudio - link2pay Service for contest demo only"
        }
      }
    };
      message.channel.send(embed);
}
function DC_resultError_regError(message,err_msg){
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title:' Failed to registration' + ' - link2pay payment Service' ,
        url: 'https://link2pay.mipodstudio.com/',
        description: err_msg,
        fields: [
          {
            name: 'ERROR',
            value: "using **__!link2pay register [Email][Bank_code][account]__** try again"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©MipodStudio - link2pay Service for contest demo only"
        }
      }
    };
      message.channel.send(embed);
}
function DC_resultError_reg(message,err_msg){
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title:' Failed' + ' - link2pay payment Service' ,
        url: 'https://link2pay.mipodstudio.com/',
        description: err_msg,
        fields: [
          {
            name: 'You already register',
            value: "using **__!link2pay create [title][amount][description] __** to create your first order link"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©MipodStudio - link2pay Service for contest demo only"
        }
      }
    };
      message.channel.send(embed);
}
function DC_result_reg(message,input){
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title:'Registed Successfully   -' + message.author.username + '     - link2pay payment Service' ,
        url: 'https://link2pay.mipodstudio.com/',
        description: 'Registed Successfully',
        fields: [
          {
            name: 'You registed successfully',
            value: "using **__!link2pay create [title][amount][description] __** to create your first order link"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©MipodStudio - link2pay Service for contest demo only"
        }
      }
    };
      message.channel.send(embed);
}
function DC_resultError_del(message,err_msg){
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title:' Failed to delete' + ' - link2pay payment Service' ,
        url: 'https://link2pay.mipodstudio.com/',
        description: err_msg,
        fields: [
          {
            name: 'Fail to delete',
            value: "using **__!link2pay delete [order unique serial] __** to delete your order link"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©MipodStudio - link2pay Service for contest demo only"
        }
      }
    };
      message.channel.send(embed);
}
function DC_result_del(message,input){
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title:'Deleted Successfully   -' + input[2] + '     - link2pay payment Service' ,
        url: 'https://link2pay.mipodstudio.com/',
        description: 'RegiDeletedsted Successfully',
        fields: [
          {
            name: 'You could go get more link to get rich',
            value: "using **__!link2pay create [title][amount][description] __** to create your  order link"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©MipodStudio - link2pay Service for contest demo only"
        }
      }
    };
      message.channel.send(embed);
}




function DC_resultEmbed(message,owner,title,amount,description,serial){

	if(!description){description='no description';}
    var embed = {embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title:title+'      '+'' ,
        url: 'https://link2pay.mipodstudio.com/'+serial,
        description: description,
        fields: [{
            name: "Amount",
            value: amount+'$.NTD'
          },{
            name: "COPY or Checkout this link2pay link to Pay",
            value: 'https://link2pay.mipodstudio.com/'+serial,
          },
          {
            name: "Order Link Serial ",
            value: " **__"+serial+"__** "
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©MipodStudio"
        }
      }
    };
	message.channel.send(embed);
}
