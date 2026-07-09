const OxoApiUrl = process.env.NEXT_PUBLIC_OXO_API_URL;

export const uploadImage = async (file: File) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${OxoApiUrl}/api/affiliate/upload-image`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok || !responseData?.success) {
      throw new Error(responseData?.message || "Failed to upload image");
    }

    return responseData.data?.url ?? null;
  } catch (error) {
    console.error("Upload image error:", error);
    return null;
  }
};
