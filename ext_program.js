

//var body = null;
module.exports.runSendMail = function(address,rank,subject,simei,id,url,callback_func) {
    var nodemailer = require('nodemailer');
    var smtpConfig = {
        port: 465,
        host: 'smtp.gmail.com',
        secureConnection: true,
        auth: {
            user: 'ココにgmailのID',
            pass: 'ココにgmailのパスワード'
        }
    };
    const transporter = nodemailer.createTransport(smtpConfig);
    var body01 = '様。\r\n';
    var body02 = 'この度は当ホテルに会員登録いただき、誠にありがとうございました。\r\n';
    var body03 = '登録手続きが完了いたしましたので、ご連絡申し上げます。\r\n';
    var body04 = 'ユーザーID：';
    var body05 = 'パスワードは登録時に設定頂いたものをお使い頂けます。\r\n';
    var body06 = 'ご登録頂いた内容につきましては、以下のアドレスにてご確認頂けます。\r\n';
    var body07 = 'それでは、ご利用を心からお待ち申し上げております。\r\nhttps://hotel.testplanisphere.dev/ja/index.html';

    var body = rank + '\r\n' + simei + body01 + body02 + body03 + body04 + id + '\r\n' + body05 + body06 + url + '\r\n' + body07;

   transporter.sendMail({
       from: '送信元アドレス',
       to: 'テストに使うgmailアドレス',
       subject: subject,
       text: body
   }, function(e, res){
       console.log(e ? e.message : res.message);
       smtp.close();
   });
    return body;
}

