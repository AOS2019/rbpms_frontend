export const uploadDailyReport = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return fetch("http://localhost:5000/api/daily-report/upload", {
    method: "POST",
    body: formData,
  });
};