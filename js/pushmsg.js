

const message = {
    type: 'text',
    text: 'I am a bad guy'
};
module.exports=async function(client,eve){
client.pushMessage(`${eve}.source.userId`, message)
  .then(() => {
    console.log("OK");
  })
  .catch((err) => {
    console.log(err);
  });
}