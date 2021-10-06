let emailTestTable = new DataTable(['Subject', 'url', 'verifyTitle', 'verifyWord', '会員ランク', '会員氏名', '会員ID', '会員Pass']);
emailTestTable.add(['会員登録完了のご連絡001','https://hotel.testplanisphere.dev/ja/login.html','ログイン | HOTEL PLANISPHERE - テスト自動化練習サイト','ご利用を心からお待ち申し上げております。', 'プレミアム会員', '山田一郎', 'ichiro@example.com', 'password']);
emailTestTable.add(['会員登録完了のご連絡002','https://hotel.testplanisphere.dev/ja/index.html','ログイン | HOTEL PLANISPHERE - テスト自動化練習サイト','ご利用を心からお待ち申し上げております。', 'プレミアム会員', '山田一郎', 'ichiro@example.com', 'password']);
emailTestTable.add(['会員登録完了のご連絡003','https://hotel.testplanisphere.dev/ja/login.html','ログイン | HOTEL PLANISPHERE - テスト自動化練習サイト','ご利用を心からお待ち申し上げております。', '一般会員', '山田一郎', 'ichiro@example.com', 'password']);
emailTestTable.add(['会員登録完了のご連絡004','https://hotel.testplanisphere.dev/ja/login.html','ログイン | HOTEL PLANISPHERE - テスト自動化練習サイト','ご利用を心からお待ち申し上げます。', 'プレミアム会員', '山田一郎', 'ichiro@example.com', 'password']);
emailTestTable.add(['会員登録完了のご連絡005','https://hotel.testplanisphere.dev/ja/login.html','ログイン | HOTEL PLANISPHERE - テスト自動化練習サイト','ご利用を心からお待ち申し上げております。', '一般会員', '松本さくら', 'sakura@example.com', 'pass1234']);
emailTestTable.add(['会員登録完了のご連絡006','https://hotel.testplanisphere.dev/ja/login.html','ログイン | HOTEL PLANISPHERE - テスト自動化練習サイト','ご利用を心からお待ち申し上げております。', 'プレミアム会員', '林潤', 'jun@example.com', 'pa55w0rd!']);
emailTestTable.add(['会員登録完了のご連絡007','https://hotel.testplanisphere.dev/ja/login.html','ログイン | HOTEL PLANISPHERE - テスト自動化練習サイト','ご利用を心からお待ち申し上げております。', '一般会員', '木村良樹', 'yoshiki@example.com', 'pass-pass']);


Feature('eMailTest');

Data(emailTestTable).Scenario('eMail_Test', async ({I , current}) => {
    var gi = require('../gmail_imap.js');
    var xp = require('../ext_program.js');

//inbox待受け
    startMessage = await gi.run3("ココにgmailのID","ココにgmailのパスワード");
    I.wait(2);
    console.log(startMessage);

//テスト用メール送信
    var sendMail = xp.runSendMail("テストに使うgmailアドレス",current.会員ランク,current.Subject,current.会員氏名,current.会員ID,current.url,null);
//ここまで

//メール受信検証
    let newID = await gi.receive2();
    if(newID != null){
        mail = await gi.parsedMail(newID);
        await console.log(mail);
    }
//文面の文言検証
    I.assertContain(mail, current.verifyWord);
    const memberid = await mail.match(/[A-Za-z0-9_.-]*@example.com/)[0];
    const url = await mail.match(/https?:\/\/(.*?)\/login.html/)[0];

//文面から取得したURLに移動
    I.amOnPage(url);
//移動先の検証、ここではタイトル
    I.seeTitleEquals(current.verifyTitle);
//文面から取得したアカウントでログイン
    I.fillField('email', memberid);
    I.fillField('password', current.会員Pass);
    I.waitForClickable('#login-button');
    I.click('#login-button');
//文面から移動した会員ページの検証
    I.see(current.会員ID);
    I.see(current.会員氏名);
    I.see(current.会員ランク);
    I.click('#logout-form > button');
});
