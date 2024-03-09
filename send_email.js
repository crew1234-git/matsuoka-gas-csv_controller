// フォルダ内にあるCSVファイルをチェックし、条件に合致するファイルをメールで送信後に削除する
const sendCsvFilesAsEmail = () => {
  const parentFolder = DriveApp.getRootFolder(); // マイドライブのルートフォルダを取得
  const folders = parentFolder.getFoldersByName(PROCESSED_FOLDER_NAME); // 指定した名前のフォルダを検索

  while (folders.hasNext()) {
    const folder = folders.next();
    const files = folder.getFilesByType(MimeType.CSV);

    while (files.hasNext()) {
      const file = files.next();
      const email = file.getName().replace('.csv', ''); // ファイル名からメールアドレスを取得
      const newFileName = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss') + '.csv';
      
      // ファイル名を更新
      const newFile = file.makeCopy(newFileName, folder);
      file.setTrashed(true); // 元のファイルを削除
      
      // メール送信の設定
      const blob = newFile.getBlob();
      MailApp.sendEmail({
        to: email,
        subject: 'CSVファイル送信',
        body: '添付ファイルをご確認ください。',
        attachments: [blob]
      });
      
      // 送信したファイルを削除
      newFile.setTrashed(true);
    }
  }
}
