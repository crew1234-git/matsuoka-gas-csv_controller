// POSTリクエストを処理する関数
const doPost = (e) => {
  try {
    // JSON形式のデータを解析
    const postData = JSON.parse(e.postData.contents);
    const token = postData.token;

    if (token === PROCESSED_TOKEN) {
      // Base64エンコードされたファイルコンテンツをデコード
      const fileBlob = Utilities.newBlob(Utilities.base64Decode(postData.file_content), 'text/csv', postData.file_name);
      uploadFileToDrive(fileBlob, PROCESSED_FOLDER_NAME);
      return createJsonResponse("ファイルが正常に保存されました。", true);

    } else if (token === UPLOAD_TOKEN) {
      const csvData = postData.data.map(row => row[0]).join("\n");
      const filenamePrefix = postData.filenamePrefix;
      const dateTime = formatDate(new Date());
      const fileName = `${filenamePrefix}_${dateTime}.csv`;
      uploadCsvToDrive(csvData, fileName, 'text/csv', UPLOAD_FOLDER_NAME);
      return createJsonResponse("CSVデータが正常に保存されました。", true);
    } else {
      throw new Error("不正なトークンです。");
    }
  } catch (error) {
    return createJsonResponse(error.message, false);
  }
}

// 成功時とエラー時のレスポンスをJSON形式で返すヘルパー関数
const createJsonResponse = (message, success) => {
  return ContentService.createTextOutput(JSON.stringify({ success, message }))
    .setMimeType(ContentService.MimeType.JSON);
}

// CSVファイルをGoogle Driveに保存する関数（processed用）
const uploadFileToDrive = (fileBlob, folderName) => {
  // 指定されたフォルダを取得、または作成
  const folder = getOrCreateFolder(folderName);

  folder.createFile(fileBlob); // Blobをそのままファイルとして保存
};

// CSVファイルをGoogle Driveに保存する関数（upload用）
const uploadCsvToDrive = (csvData, fileName, fileType, folderName) => {
  // 指定されたフォルダを取得、または作成
  const folder = getOrCreateFolder(folderName);

  // CSVデータをBlobとしてエンコード
  const blob = Utilities.newBlob(csvData, fileType, fileName);

  // Blobをファイルとしてフォルダに保存
  folder.createFile(blob);
};


// GoogleDriveにフォルダを作成する処理
const getOrCreateFolder = (folderName) => {
  // Googleドライブのルートディレクトリ内でフォルダを検索
  const folders = DriveApp.getFoldersByName(folderName);
  let folder;

  // フォルダが存在する場合、最初のフォルダを使用
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    // 存在しない場合、新しいフォルダを作成
    folder = DriveApp.createFolder(folderName);
  }

  return folder;
}