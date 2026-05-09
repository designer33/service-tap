/**
 * Resizes an image to fit within max dimensions using canvas
 * @param {string} base64 - Source image base64
 * @param {number} maxWidth - Max width
 * @param {number} maxHeight - Max height
 * @param {number} quality - JPEG quality (0 to 1)
 * @returns {Promise<string>} - Resized image base64
 */
export const resizeImage = (base64, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compression logic to ensure < 100KB
      let currentQuality = quality;
      let output = canvas.toDataURL('image/jpeg', currentQuality);
      
      // If over 100KB, reduce quality until it fits
      while (output.length > 135000 && currentQuality > 0.1) {
        currentQuality -= 0.15;
        output = canvas.toDataURL('image/jpeg', currentQuality);
      }

      resolve(output);
    };
    img.onerror = (err) => reject(err);
  });
};
