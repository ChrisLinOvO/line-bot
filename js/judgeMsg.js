const { insert, getIDall ,getPublic,deletes,getIDnb}=require('./database');

async function MsgInsert(msg,id,gp_id){//--判斷@@&輸入到Database
    //EX: msg = @{cla}books@{texts}http://abc1234
    return new Promise((resolve,reject)=>{
        if(msg[0].includes('@') && msg.substr(1).indexOf("@")!=-1 && msg.substr(1).indexOf("@")!=0){//Public 開頭@ && 後面文字還有包含@  EX:@book@book1
            const sec=msg.substr(1).indexOf("@");//-第2個@ 的位置
            const cla=msg.substr(1,sec);//--取得類別{cla}
            const texts=msg.substr(sec+2);//取得網址{texts}
            insert(cla,texts,id,gp_id);            
            resolve('輸入成功');
        }
        else if(msg[0].includes('@') && msg[1].includes('@')){//-搜尋關鍵字 EX:@@book
            const keyword=msg.substr(2);            
            getPublic(keyword,id,gp_id).then((data)=>{//--Promise處理非同步 示範a() -> setTimeout -> b()                
                //console.log(data);
                if(data=='')data='查詢不到關鍵字';
                resolve(data);
            }).catch((err)=>{
                console.log(err);
            });
        }
        else if(msg.includes('$$') && msg.length==2){//輸出當下所有 文章編號/總攬  EX:$$
            getIDall(id,gp_id).then((data)=>{             
                resolve(data);
            }).catch((err)=>{
                console.log(err);
            });
        }
        else if(msg.includes('$$my') && msg.length==4){//輸出自己所有 文章編號/總攬 EX:$$my            
            getIDall(id,'0').then((data)=>{             
                resolve(data);
            }).catch((err)=>{
                console.log(err);
            });
        }
        else if(msg.includes('$$my') && msg.length>4){//輸出自己所有 文章編號/總攬 EX:$$my            
            const number=msg.substr(4);
            getIDnb(id,'0',number).then((data)=>{             
                resolve(data);
            }).catch((err)=>{
                console.log(err);
            });
        }
        else if(msg.substr(0,2).includes('$$') && msg.length>2){//輸出當下第N筆 data  EX:$$0
            const number=msg.substr(2);
            getIDnb(id,gp_id,number).then((data)=>{             
                resolve(data);
            }).catch((err)=>{
                console.log(err);
            });
        }
        else if(msg[0].includes('@') && msg[1].includes('$')){//-刪除第X筆data EX:@$1
            const keyword=msg.substr(2);
            deletes(id,gp_id,keyword).then((data)=>{             
                resolve(data);
            }).catch((err)=>{
                console.log(err);
            });
        }
        else if(gp_id=='0'){//--只有在單獨與 BOT 聊天才會回復 格式錯誤
            resolve('請輸入正確指令');
        }
        
    });
}

// async function MsgGet(id){
//     return new Promise((resolve,reject)=>{
//         getall(id);
//         resolve('輸入成功');
//     });
// }

module.exports.MsgInsert=MsgInsert;
module.exports.MsgGetIdAll=getIDall;