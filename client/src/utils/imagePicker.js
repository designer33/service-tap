import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

/**
 * Capture or pick an image using Capacitor Camera
 * @param {string} source - 'CAMERA', 'PHOTOS', or 'PROMPT'
 */
export const pickImage = async (source = 'PROMPT') => {
  try {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource[source] || CameraSource.Prompt,
      width: 1000, // Limit width to keep base64 small
    });

    return image.dataUrl;
  } catch (err) {
    console.error('Image picking failed:', err);
    // User might have cancelled
    return null;
  }
};
