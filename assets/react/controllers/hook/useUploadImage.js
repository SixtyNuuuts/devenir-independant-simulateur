const useUploadImage = () => {
  const uploadImage = async (file, type, name) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("name", name);

    try {
      const response = await fetch('/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      return await response.json();
    } catch (err) {
      return `Erreur lors du téléchargement de l'image : ${err.message}`;
    }
  };

  return { uploadImage };
};

export default useUploadImage;
