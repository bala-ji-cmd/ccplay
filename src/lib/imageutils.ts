import sharp from 'sharp';

// Function to compress an image using sharp
export async function compressImage(base64Data: string): Promise<string> {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Resize and compress the image
    const compressedImageBuffer = await sharp(buffer)
      .resize(400) // Resize to width of 400px (maintains aspect ratio)
      .jpeg({ quality: 70 }) // Convert to JPEG with 70% quality
      .toBuffer();
    
    // Convert back to base64
    return compressedImageBuffer.toString('base64');
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original if compression fails
    return base64Data;
  }
}