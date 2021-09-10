'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const dotenv=require("dotenv");
const { MsgInsert,MsgGetIdAll }=require('./js/judgeMsg');
//const { insert,getall }=require('./js/database');


dotenv.config();

// create LINE SDK config from env variables
const configs = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret
};
const client = new line.Client(configs);

const app = express();

app.get('/',(req,res)=>{
  res.send('PiPi Bot is Running!');
});

app.post('/callback', line.middleware(configs), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const teach_message={ 
  type: 'text',
  text: `\r\n指令介紹
  \r\n(當下=該群組/自己私聊)
  \r\n打開指令介紹:\r\n**
  \r\n增加紀錄:\r\n@標題@內容\r\nEX:@好用的BOT@QQ小皮妞😉
  \r\n搜詢當下關鍵字:\r\n@@關鍵字\r\nEX:@@BOT
  \r\n刪除當下第N筆文章:\r\n@$N\r\nEX:@$0
  \r\n輸出當下"文章編號(第N*10筆)":\r\n$$$N\r\nEX:$$$1
  \r\n輸出當下第N筆文章:\r\n$$N\r\nEX:$$0
  \r\n輸出自己"文章編號(第N*10筆)":\r\n$$$myN\r\nEX:$$$my1
  \r\n輸出自己第N筆文章:\r\n$$myN\r\nEX:$$my0
  `
};
// event handler
function handleEvent(event) {
  //console.log(event);
  if(event.type == 'postback'){//-type=postack
    if(event.postback.data==='action=getdata'){
      MsgGetIdAll(event.source.userId,'0').then((data)=>{//--Promise處理非同步取得所有文章        
          let echo = { 
            type: 'text',
            text: ''
          };
          echo.text=data;
          return client.replyMessage(event.replyToken, echo);
      }).catch((err)=>{
          console.log(err);
      });    
    }else if(event.postback.data==='action=teach'){//--menu 點選說明
          return client.replyMessage(event.replyToken,teach_message);
    }
  }
  else if(event.type !== 'message' || event.message.type !== 'text') {  
    return Promise.resolve(null);
  }else if(event.message.text.includes('**')&&event.message.text.length==2){//--show指示
    return client.replyMessage(event.replyToken,teach_message);
  }else{//type=message and Pure text   
    let echo = { 
      type: 'text',
      text: ''
    };
    let gp_id='0';
    if(event.source.type=='group')gp_id=event.source.groupId;
    MsgInsert(event.message.text,event.source.userId,gp_id).then((data)=>{//--Promise處理非同步 示範a() -> setTimeout -> b()
        echo.text=data;
        return client.replyMessage(event.replyToken, echo);
    }).catch((err)=>{
        console.log(err);
    });
  }
  
}



// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
//https://miro.medium.com/max/700/1*Aop6E8wjRxdw8ILenwnY2A.png
