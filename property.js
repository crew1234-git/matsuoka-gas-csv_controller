const UPLOAD_TOKEN = "cJrAD9Es62qm0Z3eE6uzQQe2dpc1t8QnWZrHOMgMb";
const PROCESSED_TOKEN = "maDxM3q9jiDay1oysX6oDAV8hCY6HTa1AC6EZbN";
const UPLOAD_FOLDER_NAME = "Upload_CSV";
const PROCESSED_FOLDER_NAME = "Processed_CSV";

// 日時フォーマット関数
const formatDate = (date) => {
  const twoDigits = (num) => num.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = twoDigits(date.getMonth() + 1); // 月は0から始まるため、1を加える
  const dd = twoDigits(date.getDate());
  const hh = twoDigits(date.getHours());
  const mm = twoDigits(date.getMinutes());
  const ss = twoDigits(date.getSeconds());

  return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
};