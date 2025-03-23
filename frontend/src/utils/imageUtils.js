export const getImageUrl = (imageId) => {
  if (!imageId) return null;
  return `http://localhost:8080/api/images/${imageId}`;
};