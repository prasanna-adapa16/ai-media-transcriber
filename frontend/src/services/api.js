const API_BASE_URL = "http://localhost:8080/api";

export const uploadMedia = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/media/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Upload failed"
    );
  }

  return await response.json();
};