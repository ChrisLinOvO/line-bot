const mongodb = require('mongodb');


async function loadPostsCollection() {//--database ensure
    const DBclient = await mongodb.MongoClient.connect(
        process.env.mongodbdata,
        {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }
    );
    return DBclient.db('basic1').collection('posts');
}

async function insert(cla,msg,id,gp_id){//-輸入資料 @@=public $$=private
    const posts = await loadPostsCollection();
    await posts.insertOne({
        class:cla,
        text: msg,
        userId:id,
        groupId:gp_id,
        like:0,
        createdAt: new Date()
    });
}

async function getIDall(id, gp_id, ctn){//--找database當下所有data編號&data content
    let ctNb = parseInt(ctn);
    const posts = await loadPostsCollection();
    let Search_jg={'userId':`${id}`};//如果是私聊
    if(gp_id!='0')Search_jg={'groupId':`${gp_id}`};//-如果 是群組 / 不是私聊

    const datas=await posts.find(Search_jg).toArray();
    
    let said='';
    if(datas.length<=0){
      said='目前沒有文章'; 
      return Promise.resolve(said);
    }

    if(ctNb*10>datas.length)return Promise.resolve(`超過最大比數(${datas.length})`);

    Object.values(datas).slice(ctNb*10, (ctNb +1) *10 ).map((item,bigindex) =>{//-output many Obj array  
        Object.values(item).forEach((element, index, array)=>{
          //console.log(element);
          if(index==1){
            said=said+`----------------------\r\n(${ctNb*10+bigindex})${element}`;
          }else if(index==2){
            said=said+'\r\n'+element+'\r\n';
          }          
        });
    });
    //echo.text=said; 
    return Promise.resolve(said);
}

async function getIDnb(id,gp_id,nb){//-刪除第nb個
  const posts = await loadPostsCollection();

  let Search_jg={'userId':`${id}`};//如果是私聊
  if(gp_id!='0')Search_jg={'groupId':`${gp_id}`};//-如果 是群組 / 不是私聊

  const datas=await posts.find(Search_jg).toArray();
  let said='';
  if(nb>=0&&nb<datas.length){
      said=`----------------------\r\n(${nb})${datas[nb]['class']}\r\n${datas[nb]['text']}`;
  }else{
      said=`沒有該項目或是指令錯誤`;
  }
  return Promise.resolve(said);
}

async function getPublic(keyword,id,gp_id){//--搜尋關鍵字 -> 找database Public=true然後找includes
    const posts = await loadPostsCollection();

    let Search_jg={'userId':`${id}`};//如果是私聊
    if(gp_id!='0')Search_jg={'groupId':`${gp_id}`};//-如果 是群組 / 不是私聊

    const datas=await posts.find(Search_jg).toArray();
    let said='';
    let now_nb=0;
    const max_msg_nb=10;
    Object.values(datas).map((item) =>{//-output many Obj array                                     
        let has_word=false;
        Object.values(item).forEach((element, index, array)=>{
            //console.log(element);
            if(now_nb<max_msg_nb){//--不要超出最多筆
              if(index==1&&element.includes(keyword)){
                has_word=true;              
                said=said+"----------------------"+'\r\n'+element;
              }else if(index==2&&has_word){
                said=said+'\r\n'+element+'\r\n';
                now_nb++;
              }
            }else{
              return Promise.resolve(said);          
            }
        });
    });
    return Promise.resolve(said);

}

async function deletes(id,gp_id,nb){//-刪除第nb個
  const posts = await loadPostsCollection();

  let Search_jg={'userId':`${id}`};//如果是私聊
  if(gp_id!='0')Search_jg={'groupId':`${gp_id}`};//-如果 是群組 / 不是私聊

  const datas=await posts.find(Search_jg).toArray();
  let said='';
  if(nb>=0&&nb<datas.length){
      posts.remove({_id:datas[nb]['_id']});
      said=`刪除第${nb}成功`;
  }else{
      said=`沒有該項目或是指令錯誤`;
  }
  return Promise.resolve(said);
}

module.exports.insert=insert;
module.exports.getIDall=getIDall;
module.exports.getPublic=getPublic;
module.exports.deletes=deletes;
module.exports.getIDnb=getIDnb;