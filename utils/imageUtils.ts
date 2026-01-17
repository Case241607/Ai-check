
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Creates a low-resolution thumbnail from a base64 string or URL.
 * Used to store in LocalStorage without hitting quota limits.
 */
export const createThumbnail = (base64OrUrl: string, maxWidth = 100): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    // Check if it already has prefix, if not add it assuming PNG for simplicity in internal logic
    const src = base64OrUrl.startsWith('data:') 
      ? base64OrUrl 
      : `data:image/png;base64,${base64OrUrl}`;
      
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = img.height / img.width;
      
      canvas.width = maxWidth;
      canvas.height = maxWidth * ratio;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Use JPEG with low quality for maximum compression
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      } else {
        resolve(src); // Fallback
      }
    };
    img.onerror = () => resolve(src); // Fallback
  });
};
