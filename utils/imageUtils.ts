
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Compresses and resizes an image file for API optimization.
 * Resizes large images to max 1536px dimension and converts to JPEG (0.8 quality).
 */
export const processImageForApi = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1536; // Optimal size for Gemini Vision

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Fill white background for transparent PNGs
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with 0.8 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        resolve({ base64, mimeType: 'image/jpeg' });
      };
      img.onerror = (err) => reject(new Error("Failed to load image"));
    };
    reader.onerror = (err) => reject(new Error("Failed to read file"));
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
