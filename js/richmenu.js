const fs=require('fs');
const richmenu = {    
  "size": {
    "width": 2500,
    "height": 1686
  },
  "selected": false,
  "name": "Nice richmenu",
  "chatBarText": "Tap to open",
  "areas": [
    {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 2500,
        "height": 1686
      },
      "action": {
        "type": "postback",
        "data": "action=buy&itemid=123"
      }
    }
  ]
}

module.exports=async function(client){
    await client.createRichMenu(richmenu)
    .then((richMenuId) => {
        console.log(richMenuId);
        client.setDefaultRichMenu(richMenuId).setRichMenuImage(richMenuId, fs.createReadStream('./example.png'));
    });
    

}