var inbox = require('inbox');
var iconv = require('iconv');

var sleep = require('sleep-async')();
const simpleParser = require('mailparser').simpleParser;

var ptn_string  = "Content-Type: text/plain; charset=";
var ptn2_string = "Content-Type: text/html; charset=";
var ptn_encode_string = "Content-Transfer-Encoding: ";
var mime_string = "MIME-Version";
var client;

module.exports.run3 = async function(username,password) {
    var res;
    client = inbox.createConnection(false, "imap.gmail.com", {
        secureConnection: true,
        auth:{
            user: username,
            pass: password
        }
    });

    client.connect();
    sleep.sleep(2000, function(){});

    let promise1 = await new Promise((resolve, reject) => {
        client.on("connect", function(){
            resolve('Successfully connected to server' + '\n');
        });
    }).then(async(onRes) => {
        let promise2 = await new Promise((resolve, reject) => {
            client.openMailbox("INBOX", function(error, info){
                sleep.sleep(2000, function(){});
                if(error){
                    throw error;
                    reject('error');
                }
                resolve('Message count in INBOX: ' + info.count);
            });
        }).catch((openRes) => openRes);
        res = onRes + promise2;
    });
    return await res;
};


let parsed;
module.exports.parsedMail = async function(uid) {
    var resMail;
    var messageStreame = await client.createMessageStream(uid);
    await simpleParser(messageStreame)
      .then(mail=> {
        resMail = mail.text;
      })
      .catch(err=> {
          console.log(err);
      });
    client.close();
    return resMail;
};

module.exports.receive2 =  async function(){
    console.log('Mail listen...');
    var res;
    let promise3 = await new Promise(async(resolve, reject) => {
        await client.on("new", async function(message){
            if(message == null){
                reject('error');
            }
            var body01 = '----------------------------------------------------------' + '\n';
            var body02 = '日時:' + await message.date + '\n';
            var body03 = '送信者:' + await message.from.name + '-' + await message.from.address + '\n';
            var body04 = 'タイトル:' + await message.title + '\n';
            var body = body01 + body02 + body03 + body04;
            resolve(message.UID);
        });
    }).then((uid) => {
        res = uid;
    });
    return await res;
}

module.exports.close = function(){
    client.close();
}
